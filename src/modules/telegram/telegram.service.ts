import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { UserService } from '../user/user.service';

export interface TelegramOptions {
  token: string;
  chatId: string;
}

@Injectable()
export class TelegramService {
  private readonly bot: Telegraf;

  constructor(
    @Inject('TELEGRAM_CONFIG') private readonly config: TelegramOptions,
    private readonly userService: UserService,
  ) {
    this.bot = new Telegraf(config.token);
    this.bot.launch();

    this.bot.start(this.onStart.bind(this));
    this.bot.on('message', this.onMessage.bind(this));
  }

  async onStart(message: any) {
    await this.send(
      message.chat.id,
      'Send me your email and I will save your telegram id',
    );
  }

  async onMessage(message: any) {
    const text = message.update.message.text;
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!regex.test(text)) {
      return this.send(message.chat.id, 'Invalid email');
    }

    const user = await this.userService.getByEmail(text);

    if (!user) {
      return this.send(message.chat.id, 'User not found');
    }

    await this.userService.update(user._id.toString(), {
      telegramId: message.chat.id,
    });
    await this.send(this.config.chatId, 'Telegram id saved');
  }

  async send(telegramId: number | string, message: string) {
    await this.bot.telegram.sendMessage(telegramId, message);
  }

  async sendMarkdown(telegramId: number | string, message: string) {
    await this.bot.telegram.sendMessage(telegramId, message, {
      parse_mode: 'MarkdownV2',
    });
  }

  async sendHtml(telegramId: number | string, message: string) {
    await this.bot.telegram.sendMessage(telegramId, message, {
      parse_mode: 'HTML',
    });
  }
}
