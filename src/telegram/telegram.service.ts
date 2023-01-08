import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';

export interface TelegramOptions {
  token: string;
  chatId: string;
}

@Injectable()
export class TelegramService {
  private readonly bot: Telegraf;

  constructor(
    @Inject('TELEGRAM_CONFIG') private readonly config: TelegramOptions,
  ) {
    this.bot = new Telegraf(config.token);
  }

  async send(message: string) {
    await this.bot.telegram.sendMessage(this.config.chatId, message);
  }

  async sendMarkdown(message: string) {
    await this.bot.telegram.sendMessage(this.config.chatId, message, {
      parse_mode: 'MarkdownV2',
    });
  }

  async sendHtml(message: string) {
    await this.bot.telegram.sendMessage(this.config.chatId, message, {
      parse_mode: 'HTML',
    });
  }
}
