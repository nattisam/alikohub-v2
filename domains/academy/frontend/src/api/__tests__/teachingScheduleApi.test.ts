import { teachingScheduleApi } from "../teachingScheduleApi";

// Mock the academyApi
jest.mock("../../api", () => ({
  academyApi: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("teachingScheduleApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have getInstructorSchedules method", () => {
    expect(typeof teachingScheduleApi.getInstructorSchedules).toBe("function");
  });

  it("should have getCourseSchedules method", () => {
    expect(typeof teachingScheduleApi.getCourseSchedules).toBe("function");
  });

  it("should have createSchedule method", () => {
    expect(typeof teachingScheduleApi.createSchedule).toBe("function");
  });

  it("should have updateSchedule method", () => {
    expect(typeof teachingScheduleApi.updateSchedule).toBe("function");
  });

  it("should have deleteSchedule method", () => {
    expect(typeof teachingScheduleApi.deleteSchedule).toBe("function");
  });

  it("should have getScheduleById method", () => {
    expect(typeof teachingScheduleApi.getScheduleById).toBe("function");
  });
});