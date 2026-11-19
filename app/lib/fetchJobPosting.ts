// app/lib/fetchJobPosting.ts
// Fetches a job posting URL server-side and extracts readable text from the
// HTML, with no third-party parser dependency — job posting pages are
// simple enough that stripping tags/scripts/styles and decoding entities is
// sufficient. Many job boards render postings via client-side JS, so this
// can come back short/empty for those; the caller surfaces that as a
// warning rather than failing the whole request, since the admin can still
// paste the description manually.

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./,
  /^::1$/,
  /\.local$/i,
];

function htmlToText(html: string): string {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(br|p|div|li|h[1-6]|tr)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"');

  return text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export async function fetchJobPostingText(rawUrl: string): Promise<string> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http/https job posting URLs are supported.");
  }
  if (PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(parsed.hostname))) {
    throw new Error("That URL isn't allowed.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioCoverLetterBot/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Job posting page returned ${response.status}.`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      throw new Error("That URL didn't return a readable page.");
    }

    const html = await response.text();
    const text = htmlToText(html);

    if (text.length < 100) {
      throw new Error(
        "Couldn't extract readable text from that page — it may require JavaScript to load. Paste the job description instead.",
      );
    }

    return text.slice(0, 8000);
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Timed out fetching that job posting URL.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
