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
