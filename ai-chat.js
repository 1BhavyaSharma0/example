// ===== NEXUS AI CHAT — Powered by Anthropic Claude API =====

const SYSTEM_PROMPT = `You are NEXUS AI, a friendly and expert digital marketing consultant for NEXUS Digital Agency. 

NEXUS offers these services:
1. Web Development - Custom websites, e-commerce, web apps, CMS integration
2. Social Media Marketing - Strategy, content, community management, influencer marketing
3. Content Marketing - Blog writing, video production, SEO content strategy, infographics
4. Email Marketing - Campaigns, automation workflows, segmentation, A/B testing
5. PPC Advertising - Google Ads, Meta Ads, LinkedIn Ads, conversion optimization
6. Affiliate Marketing - Program setup, partner recruitment, commission optimization
7. Public Relations - Media coverage, crisis communication, brand reputation, thought leadership

Pricing Plans:
- Starter: $999/month (website + 2 social platforms + 8 content pieces + email campaigns)
- Growth: $2,499/month (custom web dev + 5 social platforms + PPC + affiliate setup)
- Enterprise: $5,999/month (full suite including PR + unlimited content)

Key stats: 500+ clients, 98% retention rate, 12x avg ROI, 8+ years experience, $2.4B+ revenue generated for clients.

Your role:
- Answer marketing questions with expert knowledge
- Recommend appropriate NEXUS services based on the user's needs
- Provide actionable marketing tips and strategy advice
- Be conversational, helpful, enthusiastic about marketing
- Keep responses concise (2-4 sentences) but highly informative
- Always end with a gentle invitation to explore NEXUS services when relevant

Do NOT make up specific statistics about the user's business. Be honest if you don't know something.`;

async function callClaudeAPI(messages) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: messages
      })
    });

    if (!response.ok) {
      // Fallback to PHP proxy if direct API fails
      const proxyResponse = await fetch('php/ai-proxy.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });
      const proxyData = await proxyResponse.json();
      return proxyData.content;
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    // Intelligent fallback responses
    return getFallbackResponse(messages[messages.length - 1].content);
  }
}

function getFallbackResponse(userMessage) {
  const msg = userMessage.toLowerCase();

  if (msg.includes('service') || msg.includes('offer') || msg.includes('do you')) {
    return "NEXUS offers 7 core services: Web Development, Social Media Marketing, Content Marketing, Email Marketing, PPC Advertising, Affiliate Marketing, and Public Relations. Each is designed to work independently or as part of a full-stack marketing strategy. Would you like details on any specific service?";
  }
  if (msg.includes('social media') || msg.includes('instagram') || msg.includes('facebook')) {
    return "Great social media marketing starts with choosing the right platforms for your audience, creating consistent brand content, and engaging authentically with your community. Our Social Media service covers strategy, content creation, influencer partnerships, and detailed analytics. We've helped clients grow from thousands to millions of followers — would you like to explore our Social Media Marketing plan?";
  }
  if (msg.includes('ppc') || msg.includes('ads') || msg.includes('google') || msg.includes('advertising')) {
    return "PPC (Pay-Per-Click) advertising means you pay only when someone clicks your ad — making it highly cost-effective when managed correctly. NEXUS specializes in Google Ads, Meta Ads, and LinkedIn campaigns, with one client achieving an 18x ROAS. The key is precise targeting, compelling ad copy, and constant optimization. Want to explore how PPC could work for your business?";
  }
  if (msg.includes('seo') || msg.includes('traffic') || msg.includes('organic')) {
    return "SEO success comes from three pillars: technical optimization, high-quality content, and authoritative backlinks. Our Content Marketing service includes a full SEO content strategy — we've helped SaaS clients achieve 560% organic traffic growth. Consistent, keyword-targeted content is your best long-term investment. Shall I tell you more about our Content Marketing packages?";
  }
  if (msg.includes('email') || msg.includes('newsletter') || msg.includes('automation')) {
    return "Email marketing consistently delivers the highest ROI of any digital channel — often $42 for every $1 spent. The secret is proper list segmentation, personalization, and automated nurture sequences. NEXUS builds complete email automation systems from welcome series to re-engagement campaigns. Interested in seeing how we can set this up for you?";
  }
  if (msg.includes('price') || msg.includes('cost') || msg.includes('plan') || msg.includes('package')) {
    return "NEXUS has three plans: Starter ($999/mo) for growing businesses, Growth ($2,499/mo) for scaling companies needing web dev + PPC, and Enterprise ($5,999/mo) for full-stack marketing domination including PR. We also offer custom packages — every business is different! Would you like to schedule a free strategy call to find the perfect fit?";
  }
  if (msg.includes('conversion') || msg.includes('convert') || msg.includes('cro')) {
    return "Improving conversion rate is about reducing friction and building trust. Start with clear CTAs, fast page load speeds, social proof (testimonials, case studies), and A/B testing key pages. Our Web Development team builds conversion-optimized sites — one client saw a 240% increase in conversions after a redesign. Want to explore what we could do for your site?";
  }
  if (msg.includes('content') || msg.includes('blog') || msg.includes('video')) {
    return "Content marketing is a marathon, not a sprint — but the compound returns are extraordinary. The best approach: identify what questions your ideal customers are asking, create genuinely helpful content answering those questions, then distribute strategically across channels. NEXUS handles everything from blog writing to video production and infographics. Want to discuss a content strategy for your brand?";
  }
  if (msg.includes('affiliate') || msg.includes('partner') || msg.includes('referral')) {
    return "Affiliate marketing lets you pay for results only — you reward partners when they send you actual customers. It's performance-based and incredibly scalable. NEXUS sets up your entire affiliate program: technical infrastructure, partner recruitment, commission structures, and ongoing management. It's one of the most cost-efficient ways to grow. Interested in learning more?";
  }
  if (msg.includes('pr') || msg.includes('press') || msg.includes('media') || msg.includes('public relation')) {
    return "Strategic PR builds the kind of credibility that ads simply can't buy. Getting featured in Forbes, TechCrunch, or industry publications positions your brand as a thought leader and drives organic growth. NEXUS has a network of media contacts and has secured coverage for clients in 50+ top publications. Ready to build your brand's reputation?";
  }

  return "That's a great question about digital marketing! NEXUS specializes in helping businesses grow through data-driven strategies across web development, social media, content, email, PPC, affiliate marketing, and PR. Could you tell me more about your business and current marketing challenges? I'd love to point you toward the most impactful solution for your situation.";
}

// ===== CONVERSATION HISTORY =====
let conversationHistory = [];

function appendMessage(role, content, isTyping = false) {
  const chatMessages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `message ${role}`;

  const avatarHTML = role === 'bot'
    ? '<div class="msg-avatar"><i class="fas fa-robot"></i></div>'
    : '<div class="msg-avatar"><i class="fas fa-user"></i></div>';

  if (isTyping) {
    div.innerHTML = `${avatarHTML}<div class="msg-content"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
    div.id = 'typingIndicator';
  } else {
    div.innerHTML = `${avatarHTML}<div class="msg-content"><p>${content}</p></div>`;
  }

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const message = input.value.trim();
  if (!message) return;

  // Add user message
  appendMessage('user', message);
  conversationHistory.push({ role: 'user', content: message });
  input.value = '';
  sendBtn.disabled = true;

  // Show typing
  const typingEl = appendMessage('bot', '', true);

  // Call AI
  const response = await callClaudeAPI(conversationHistory);

  // Remove typing, show response
  typingEl.remove();
  appendMessage('bot', response);
  conversationHistory.push({ role: 'assistant', content: response });
  sendBtn.disabled = false;

  // Keep history manageable
  if (conversationHistory.length > 20) {
    conversationHistory = conversationHistory.slice(-20);
  }
}

function sendQuick(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}
