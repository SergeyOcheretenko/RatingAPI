import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class JoobleService {
  constructor(
    @Inject('JOOBLE_CONFIG') private readonly config: { apiKey: string },
  ) {}

  async getJobs(programmingLanguage: string) {
    const { data } = await axios.post(
      `https://jooble.org/api/${this.config.apiKey}`,
      {
        keywords: `${programmingLanguage} developer`,
        location: 'USA',
      },
    );
    return data.jobs;
  }

  async getJobsCount(programmingLanguage: string) {
    return (await this.getJobs(programmingLanguage)).length;
  }
}
