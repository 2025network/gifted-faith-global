const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const starterPosts = [
  {
    title: "UK Visitor Visa Requirements for Nigerians",
    slug: "uk-visitor-visa-requirements-for-nigerians",
    excerpt:
      "A practical overview of common documents Nigerian applicants prepare for UK visitor visa applications.",
    featuredImage:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    content: `A UK visitor visa application usually requires clear evidence of travel purpose, financial capacity, ties to Nigeria, and planned return.

Applicants commonly prepare an international passport, proof of funds, employment or business documents, invitation letters where applicable, hotel or accommodation details, travel itinerary, and evidence of family or economic ties.

The strongest applications are organized, consistent, and easy to review. Avoid unclear bank statements, unexplained deposits, missing employment information, and travel dates that do not match your supporting documents.

Gifted-Faith Global Ventures helps clients review requirements, arrange documents, and prepare a cleaner application file before submission.`,
  },
  {
    title: "Canada Study Permit Guide",
    slug: "canada-study-permit-guide",
    excerpt:
      "Understand the key documents and planning steps for a Canada study permit application.",
    featuredImage:
      "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1200&q=80",
    content: `A Canada study permit application starts with admission to a designated learning institution and a clear study plan.

Applicants usually need a valid passport, admission letter, proof of tuition payment or funding, academic records, statement of purpose, sponsor documents, and evidence showing plans after study.

Your study plan should explain why you chose the course, how it connects to your background, and why Canada is suitable for your academic goals.

Early preparation matters because financial documents, school records, and sponsor evidence often take time to arrange properly.`,
  },
  {
    title: "Schengen Visa Application Process",
    slug: "schengen-visa-application-process",
    excerpt:
      "A simple breakdown of the Schengen visa process for tourism, family visits, and business travel.",
    featuredImage:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80",
    content: `The Schengen visa process depends on your main destination, travel purpose, and planned length of stay.

Applicants commonly prepare a completed application form, passport, photographs, travel insurance, flight reservation, hotel reservation, itinerary, proof of funds, employment or business documents, and invitation documents where applicable.

You should apply through the country where you will spend the most time. If your stay is equal across countries, apply through the first country you will enter.

A well-arranged file helps the visa officer understand your trip quickly and reduces avoidable confusion.`,
  },
  {
    title: "Common Visa Rejection Reasons",
    slug: "common-visa-rejection-reasons",
    excerpt:
      "Learn common reasons visa applications are refused and how better preparation can reduce avoidable risks.",
    featuredImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    content: `Visa refusals can happen for many reasons, but some issues appear often across destinations.

Common problems include weak financial evidence, unclear travel purpose, inconsistent information, missing documents, poor explanation of ties to home country, and application forms that do not match supporting documents.

Applicants should avoid submitting documents without reviewing dates, spellings, account details, employment records, invitation information, and travel plans.

Professional document organization does not guarantee approval, but it can help reduce avoidable mistakes and make your application easier to assess.`,
  },
  {
    title: "Study Abroad Opportunities for Nigerian Students",
    slug: "study-abroad-opportunities-for-nigerian-students",
    excerpt:
      "Explore how Nigerian students can prepare for study opportunities in the UK, Canada, Europe, and beyond.",
    featuredImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    content: `Study abroad planning begins with choosing the right course, destination, institution, and budget.

Nigerian students should compare tuition costs, admission requirements, scholarship options, post-study opportunities, and visa requirements before applying.

Important documents can include academic transcripts, certificates, references, English test results where required, statement of purpose, passport, sponsor documents, and proof of funds.

Gifted-Faith Global Ventures supports students with planning, document organization, and study visa preparation so each stage is easier to manage.`,
  },
];

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS \`BlogPost\` (
      \`id\` INTEGER NOT NULL AUTO_INCREMENT,
      \`title\` VARCHAR(191) NOT NULL,
      \`slug\` VARCHAR(191) NOT NULL,
      \`excerpt\` TEXT NOT NULL,
      \`content\` LONGTEXT NOT NULL,
      \`featuredImage\` VARCHAR(191) NOT NULL,
      \`published\` BOOLEAN NOT NULL DEFAULT false,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      UNIQUE INDEX \`BlogPost_slug_key\`(\`slug\`),
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  for (const post of starterPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        published: true,
      },
    });
  }

  console.log("BlogPost table is ready.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
