/**
 * Scheduled Tasks Configuration
 * Runs automated content generation every 3 days
 */

import { runContentWorkflow } from "./contentWorkflow";

// Track last execution time
let lastExecutionTime: number = 0;
const EXECUTION_INTERVAL_MS = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

/**
 * Initialize scheduled tasks
 * Call this once when the server starts
 */
export function initializeScheduledTasks() {
  console.log("[Scheduled Tasks] Initializing automated content generation...");

  // Run content workflow immediately on startup
  runContentWorkflowSafely();

  // Schedule recurring execution every 3 days
  setInterval(() => {
    runContentWorkflowSafely();
  }, EXECUTION_INTERVAL_MS);

  console.log("[Scheduled Tasks] Content workflow scheduled to run every 3 days");
}

/**
 * Safe wrapper for content workflow execution
 * Handles errors and logging
 */
async function runContentWorkflowSafely() {
  const now = Date.now();

  // Check if enough time has passed since last execution
  if (now - lastExecutionTime < EXECUTION_INTERVAL_MS && lastExecutionTime !== 0) {
    console.log("[Scheduled Tasks] Skipping execution - interval not met");
    return;
  }

  try {
    console.log("[Scheduled Tasks] Starting content generation workflow...");
    lastExecutionTime = now;

    const result = await runContentWorkflow();

    console.log("[Scheduled Tasks] Content generation completed successfully:", {
      articleId: result.articleId,
      title: result.title,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send notification to admin/owner about new article
    // await notifyOwner({
    //   title: "New Article Published",
    //   content: `Article "${result.title}" has been auto-generated and published.`
    // });
  } catch (error) {
    console.error("[Scheduled Tasks] Content generation failed:", error);

    // TODO: Send error notification to admin
    // await notifyOwner({
    //   title: "Content Generation Failed",
    //   content: `Automated article generation failed: ${error.message}`
    // });
  }
}

/**
 * Manual trigger for content generation
 * Useful for testing or on-demand generation
 */
export async function triggerContentGeneration() {
  return runContentWorkflowSafely();
}

/**
 * Get last execution time
 */
export function getLastExecutionTime(): Date | null {
  return lastExecutionTime === 0 ? null : new Date(lastExecutionTime);
}

/**
 * Get next scheduled execution time
 */
export function getNextExecutionTime(): Date {
  if (lastExecutionTime === 0) {
    return new Date(); // Run immediately if never executed
  }
  return new Date(lastExecutionTime + EXECUTION_INTERVAL_MS);
}
