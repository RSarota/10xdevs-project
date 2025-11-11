import { describe, it, expect } from "vitest";
import { calculateHash } from "./hash";

describe("calculateHash", () => {
  it("should calculate SHA-256 hash for text", async () => {
    const text = "test text";
    const hash = await calculateHash(text);

    expect(hash).toBeTruthy();
    expect(typeof hash).toBe("string");
    expect(hash.length).toBe(64); // SHA-256 produces 64 hex characters
  });

  it("should return hash in hex format", async () => {
    const text = "test";
    const hash = await calculateHash(text);

    // Hex format: only contains 0-9 and a-f
    expect(hash).toMatch(/^[0-9a-f]+$/);
  });

  it("should produce different hash for different texts", async () => {
    const hash1 = await calculateHash("text1");
    const hash2 = await calculateHash("text2");

    expect(hash1).not.toBe(hash2);
  });

  it("should produce identical hash for same text", async () => {
    const text = "identical text";
    const hash1 = await calculateHash(text);
    const hash2 = await calculateHash(text);

    expect(hash1).toBe(hash2);
  });

  it("should handle short text", async () => {
    const hash = await calculateHash("a");

    expect(hash).toBeTruthy();
    expect(hash.length).toBe(64);
  });

  it("should handle medium length text", async () => {
    const text = "a".repeat(1000);
    const hash = await calculateHash(text);

    expect(hash).toBeTruthy();
    expect(hash.length).toBe(64);
  });

  it("should handle long text", async () => {
    const text = "a".repeat(10000);
    const hash = await calculateHash(text);

    expect(hash).toBeTruthy();
    expect(hash.length).toBe(64);
  });

  it("should handle text with Polish characters", async () => {
    const text = "ąęćłńóśźż ĄĘĆŁŃÓŚŹŻ";
    const hash = await calculateHash(text);

    expect(hash).toBeTruthy();
    expect(hash.length).toBe(64);
  });

  it("should handle text with special characters", async () => {
    const text = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
    const hash = await calculateHash(text);

    expect(hash).toBeTruthy();
    expect(hash.length).toBe(64);
  });

  it("should handle empty string", async () => {
    const hash = await calculateHash("");

    expect(hash).toBeTruthy();
    expect(hash.length).toBe(64);
    // Empty string should produce a known hash (e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)
    expect(hash).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });

  it("should handle text with newlines", async () => {
    const text = "line1\nline2\nline3";
    const hash = await calculateHash(text);

    expect(hash).toBeTruthy();
    expect(hash.length).toBe(64);
  });

  it("should handle text with tabs and spaces", async () => {
    const text = "text\twith\t\ttabs    and    spaces";
    const hash = await calculateHash(text);

    expect(hash).toBeTruthy();
    expect(hash.length).toBe(64);
  });

  it("should be deterministic (same input always produces same output)", async () => {
    const text = "deterministic test";
    const hashes = await Promise.all([calculateHash(text), calculateHash(text), calculateHash(text)]);

    expect(hashes[0]).toBe(hashes[1]);
    expect(hashes[1]).toBe(hashes[2]);
  });
});
