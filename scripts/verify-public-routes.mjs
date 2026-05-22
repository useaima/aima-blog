const baseUrl = (process.env.BASE_URL || "https://blog.useaima.com").replace(/\/+$/, "");

async function expectJson(path) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  return response.json();
}

async function expectPage(path) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  const html = await response.text();
  if (!/<html/i.test(html) && !/<!doctype/i.test(html)) {
    throw new Error(`${path} did not return an HTML document`);
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function main() {
  const indexPayload = await expectJson("/api/public/blog/index");
  const articles = Array.isArray(indexPayload.articles) ? indexPayload.articles : [];
  const categories = Array.isArray(indexPayload.categories) ? indexPayload.categories : [];
  const authors = Array.isArray(indexPayload.authors) ? indexPayload.authors : [];

  if (!articles.length) {
    throw new Error("Public blog index returned no articles.");
  }

  await Promise.all([
    expectPage("/"),
    expectPage("/categories"),
    expectPage("/authors"),
    expectPage("/archive"),
  ]);

  const categorySlugs = unique(categories.map((category) => category.slug));
  const authorSlugs = unique(authors.map((author) => author.slug || author.id));
  const articleSlugs = unique(articles.map((article) => article.slug));

  for (const slug of articleSlugs) {
    await expectJson(`/api/public/blog/article?slug=${encodeURIComponent(slug)}`);
    await expectPage(`/article/${slug}`);
    await expectPage(`/${slug}`);
  }

  for (const slug of categorySlugs) {
    await expectPage(`/category/${slug}`);
  }

  for (const slug of authorSlugs) {
    await expectJson(`/api/public/blog/author?slug=${encodeURIComponent(slug)}`);
    await expectPage(`/author/${slug}`);
  }

  console.log(`Verified ${articleSlugs.length} article routes, ${categorySlugs.length} category routes, and ${authorSlugs.length} author routes against ${baseUrl}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
