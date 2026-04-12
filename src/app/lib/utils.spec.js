const { describe, it, expect } = require("vitest");
const { cn } = require("./utils");

describe("cn function", function () {
  it("should merge classes correctly", function () {
    return expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
  });

  it("should handle conditional classes", function () {
    const isActive = true;
    return expect(cn("base-class", isActive && "active-class")).toBe(
      "base-class active-class"
    );
  });

  it("should handle false and null conditions", function () {
    const isActive = false;
    return expect(cn("base-class", isActive && "active-class", null)).toBe(
      "base-class"
    );
  });

  it("should merge tailwind classes properly", function () {
    return expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("should work with object notation", function () {
    return expect(cn("base", { conditional: true, "not-included": false })).toBe(
      "base conditional"
    );
  });
});
