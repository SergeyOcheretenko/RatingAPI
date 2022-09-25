export const enum TopLevelCategory {
  COURSES,
  SERVICES,
  BOOKS,
  PRODUCTS,
}

export class RatingPageModel {
  firstCategory: TopLevelCategory;
  secondCategory: string;
  title: string;
  category: string;
  GRC?: {
    count: number;
    juniorSalary: number;
    middleSalary: number;
    seniorSalary: number;
  };
  advantages: {
    title: string;
    description: string;
  }[];
  seoText: string;
  tagsTitle: string;
  tags: string[];
}
