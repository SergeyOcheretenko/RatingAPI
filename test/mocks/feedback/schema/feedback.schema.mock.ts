export class MockFeedbackModel {
  save = jest.fn;
  static findByIdAndDelete = jest.fn;
  static find = jest.fn;
  static deleteMany = jest.fn;
}
