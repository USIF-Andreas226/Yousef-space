export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  return res.status(200).json({
    name: 'Yousef Malak Ibrahim AI Assistant',
    description: 'Ask me anything about my experience, skills, projects, or background!',
    capabilities: [
      'Answer questions about my CV and experience',
      'Provide details about my projects',
      'Discuss my technical skills and expertise',
      'General AI and technology conversations',
    ],
    runtime: 'vercel-serverless',
    offline: !process.env.OPENROUTER_API_KEY,
  });
}
