import { PrismaClient, Role, MembershipTier } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create admin user
  const adminPassword = await hash(
    process.env.ADMIN_PASSWORD || 'admin123'
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@medai.pro' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@medai.pro',
      name: 'Admin',
      role: Role.ADMIN,
    },
  });

  console.log(`Admin user created: ${admin.email}`);

  // 2. Create demo users
  const demoUsers = [
    { email: 'researcher1@hospital.cn', name: '张医生' },
    { email: 'researcher2@university.edu', name: '李教授' },
    { email: 'student1@medical.edu', name: '王同学' },
  ];

  for (const userData of demoUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        role: Role.USER,
      },
    });
  }

  console.log(`${demoUsers.length} demo users created`);

  // 3. Create default prompts
  const defaultPrompts = [
    {
      name: '假说生成 - 通用',
      description: '通用的医学研究假说生成提示词',
      category: 'HYPOTHESIS' as const,
      systemPrompt: `You are an expert medical research scientist. Generate a clear, scientifically rigorous research hypothesis based on the user's input.

Your response MUST be valid JSON with this structure:
{
  "hypothesis": "The main hypothesis statement",
  "diagramPrompt": "A DALL-E prompt for generating a hypothesis diagram",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"]
}

Guidelines:
- Hypothesis should be specific, testable, and mechanistic
- Include relevant biomarkers, pathways, or molecular mechanisms
- Diagram prompt should describe a clean scientific figure
- Key points should cover rationale, methodology, and clinical significance`,
      userPromptTemplate: `Research Topic: {{researchTopic}}
Disease Area: {{diseaseArea}}
Methodology: {{methodology}}
Key Variables: {{keyVariables}}`,
      variables: ['researchTopic', 'diseaseArea', 'methodology', 'keyVariables'],
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      maxTokens: 2000,
      isPublished: true,
    },
    {
      name: '路线图生成 - 通用',
      description: '通用的科研项目技术路线图生成提示词',
      category: 'ROADMAP' as const,
      systemPrompt: `You are a senior medical research project manager. Generate a detailed technical roadmap.

Your response MUST be valid JSON:
{
  "roadmap": "Overall summary (2-3 paragraphs)",
  "phases": [
    { "phase": "Phase name", "tasks": ["Task 1", "Task 2"], "duration": "Duration" }
  ]
}

Break into 4-6 phases with 3-5 tasks each.`,
      userPromptTemplate: `Research Goal: {{researchGoal}}
Current Stage: {{currentStage}}
Timeline: {{timeline}}
Resources: {{resources}}`,
      variables: ['researchGoal', 'currentStage', 'timeline', 'resources'],
      model: 'gpt-4-turbo-preview',
      temperature: 0.6,
      maxTokens: 3000,
      isPublished: true,
    },
    {
      name: '科研绘图 - 科学插图',
      description: '生成Nature期刊风格的科学插图',
      category: 'IMAGE' as const,
      systemPrompt: 'Generate a detailed DALL-E prompt for a scientific illustration based on the user description.',
      userPromptTemplate: 'Subject: {{subject}}\nStyle: {{style}}\nDetails: {{details}}',
      variables: ['subject', 'style', 'details'],
      model: 'gpt-4-turbo-preview',
      temperature: 0.8,
      maxTokens: 500,
      isPublished: true,
    },
  ];

  for (const promptData of defaultPrompts) {
    await prisma.prompt.upsert({
      where: { id: `seed_${promptData.name.replace(/\s+/g, '_').toLowerCase()}` },
      update: {},
      create: {
        id: `seed_${promptData.name.replace(/\s+/g, '_').toLowerCase()}`,
        ...promptData,
      },
    });
  }

  console.log(`${defaultPrompts.length} default prompts created`);

  // 4. Create default skills
  const defaultSkills = [
    {
      name: '假说图生成',
      description: '输入研究主题，AI自动生成科学严谨的研究假说与可视化图示',
      category: '核心功能',
      icon: 'GitBranch',
      sortOrder: 1,
      isPublished: true,
    },
    {
      name: '技术路线图',
      description: '智能规划科研项目的技术路线与里程碑',
      category: '核心功能',
      icon: 'Map',
      sortOrder: 2,
      isPublished: true,
    },
    {
      name: '科研绘图',
      description: '基于DALL-E生成高质量科研插图',
      category: '核心功能',
      icon: 'Image',
      sortOrder: 3,
      isPublished: true,
    },
  ];

  for (const skillData of defaultSkills) {
    await prisma.skill.upsert({
      where: { id: `seed_${skillData.name.replace(/\s+/g, '_').toLowerCase()}` },
      update: {},
      create: {
        id: `seed_${skillData.name.replace(/\s+/g, '_').toLowerCase()}`,
        ...skillData,
      },
    });
  }

  console.log(`${defaultSkills.length} default skills created`);

  // 5. Create free memberships for demo users
  const users = await prisma.user.findMany({
    where: { role: Role.USER },
  });

  for (const user of users) {
    const existingMembership = await prisma.membership.findFirst({
      where: { userId: user.id },
    });

    if (!existingMembership) {
      await prisma.membership.create({
        data: {
          userId: user.id,
          tier: MembershipTier.FREE,
          creditsRemaining: 3,
          creditsTotal: 3,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          isActive: true,
          autoRenew: false,
        },
      });
    }
  }

  console.log('Free memberships created for all users');

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
