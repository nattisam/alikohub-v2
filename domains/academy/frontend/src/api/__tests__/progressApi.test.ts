import { progressApi } from "../progressApi";

// Mock the academyApi
jest.mock("../../api", () => ({
  academyApi: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("progressApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have getStudentDashboard method", () => {
    expect(typeof progressApi.getStudentDashboard).toBe("function");
  });

  it("should have getOverallAnalytics method", () => {
    expect(typeof progressApi.getOverallAnalytics).toBe("function");
  });

  it("should have getInstructorStats method", () => {
    expect(typeof progressApi.getInstructorStats).toBe("function");
  });

  it("should have getCourseProgress method", () => {
    expect(typeof progressApi.getCourseProgress).toBe("function");
  });

  it("should have updateProgress method", () => {
    expect(typeof progressApi.updateProgress).toBe("function");
  });
});