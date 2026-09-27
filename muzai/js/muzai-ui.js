/**
 * MUZAI CONVERSATION INTERFACE CONTROLLER
 * Manages terminal DOM state, message rendering, suggestion pills,
 * keyboard dispatch, markdown formatting, and conversation reset.
 */

document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const clearBtn = document.getElementById("clearChatBtn");
  const suggestionsBox = document.getElementById("quickSuggestions");

  if (!chatMessages || !chatInput || !sendBtn) {
    console.error("[MuzAI UI] Critical chat DOM elements missing.");
    return;
  }

  // Initialize Engine with local knowledge base
  const engine = new MuzAIEngine(typeof MUZAI_KNOWLEDGE !== "undefined" ? MUZAI_KNOWLEDGE : null);

  // Default suggested prompts
  const initialSuggestions = [
    "Who is Rohit?",
    "What has he built?",
    "Explain NEXUS",
    "What is ASAPTools?",
    "What technologies does he use?",
    "What is Rohit currently building?",
    "Compare ASAPTools and NEXUS",
    "How can I contact Rohit?"
  ];

  /**
   * Simple, fast markdown-to-HTML parser (no heavy dependencies)
   */
  function formatMarkdown(text) {
    if (!text) return "";

    let html = text
      // Escape raw HTML entities
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Markdown Headers (### Header)
    html = html.replace(/^### (.*$)/gim, '<h4 class="msg-h4">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="msg-h3">$1</h3>');

    // Bold (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italics (*text*)
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Inline Code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code class="msg-code">$1</code>');

    // Blockquotes (> quote)
    html = html.replace(/^\> (.*$)/gim, '<blockquote class="msg-quote">$1</blockquote>');

    // Markdown Links ([label](url))
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="msg-link" target="_blank" rel="noopener noreferrer">$1 ↗</a>');

    // Bullet points (* item or - item)
    html = html.replace(/^\s*[\*\-]\s+(.*$)/gim, '<li class="msg-li">$1</li>');
    html = html.replace(/((?:<li class="msg-li">.*<\/li>\s*)+)/g, '<ul class="msg-ul">$1</ul>');

    // Markdown Tables (| Header 1 | Header 2 |)
    html = html.replace(/((?:\|[^\n]+\|\r?\n?)+)/g, (tableBlock) => {
      const lines = tableBlock.trim().split(/\r?\n/).filter(l => l.trim().startsWith('|'));
      if (lines.length < 2) return tableBlock;

      const parseRow = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const headerCells = parseRow(lines[0]);
      
      let startIndex = 1;
      if (lines[1] && lines[1].includes('---')) {
        startIndex = 2;
      }

      let thead = '<thead><tr>' + headerCells.map(c => `<th>${c}</th>`).join('') + '</tr></thead>';
      let tbody = '<tbody>';
      for (let i = startIndex; i < lines.length; i++) {
        const cells = parseRow(lines[i]);
        tbody += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
      }
      tbody += '</tbody>';

      return `<div class="msg-table-wrap"><table class="msg-table">${thead}${tbody}</table></div>`;
    });

    // Paragraph line breaks
    html = html.split(/\n{2,}/).map(para => {
      para = para.trim();
      if (!para) return "";
      if (para.startsWith("<h3") || para.startsWith("<h4") || para.startsWith("<ul") || para.startsWith("<blockquote") || para.startsWith("<div class=\"msg-table-wrap\"")) {
        return para;
      }
      return `<p class="msg-p">${para.replace(/\n/g, "<br>")}</p>`;
    }).join("");

    return html;
  }

  /**
   * Scroll chat message viewport to bottom
   */
  function scrollToBottom(smooth = true) {
    requestAnimationFrame(() => {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: smooth ? "smooth" : "auto"
      });
    });
  }

  /**
   * Render User Message
   */
  function appendUserMessage(text) {
    const wrap = document.createElement("div");
    wrap.className = "chat-row user-row";

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble user-bubble";
    bubble.textContent = text;

    wrap.appendChild(bubble);
    chatMessages.appendChild(wrap);
    scrollToBottom();
  }

  /**
   * Render MuzAI Message
   */
  function appendAIMessage(responseObj) {
    const wrap = document.createElement("div");
    wrap.className = "chat-row ai-row";

    // AI Avatar / Identity badge
    const header = document.createElement("div");
    header.className = "ai-msg-header";
    header.innerHTML = `
      <span class="ai-avatar-badge">
        <span class="avatar-dot"></span>
        MUZAI
      </span>
      <span class="ai-timestamp">Just now</span>
    `;
    wrap.appendChild(header);

    // AI Message Bubble
    const bubble = document.createElement("div");
    bubble.className = "msg-bubble ai-bubble";
    bubble.innerHTML = formatMarkdown(responseObj.text);

    // Append Action Links if available
    if (responseObj.links && responseObj.links.length > 0) {
      const linksContainer = document.createElement("div");
      linksContainer.className = "msg-actions-row";

      responseObj.links.forEach(link => {
        const linkBtn = document.createElement("a");
        linkBtn.href = link.url;
        linkBtn.className = "msg-action-chip";
        linkBtn.innerHTML = `<span>${link.label}</span> <span class="arrow-up" aria-hidden="true">↗</span>`;
        if (link.external) {
          linkBtn.target = "_blank";
          linkBtn.rel = "noopener noreferrer";
        }
        linksContainer.appendChild(linkBtn);
      });

      bubble.appendChild(linksContainer);
    }

    wrap.appendChild(bubble);
    chatMessages.appendChild(wrap);

    // Update suggestions tray with contextual follow-ups if provided
    if (responseObj.suggestedFollowUps && responseObj.suggestedFollowUps.length > 0) {
      renderSuggestions(responseObj.suggestedFollowUps);
    }

    scrollToBottom();
  }

  /**
   * Render Typing / Thinking indicator
   */
  function showThinkingIndicator() {
    const wrap = document.createElement("div");
    wrap.className = "chat-row ai-row thinking-row";
    wrap.id = "thinkingIndicator";

    wrap.innerHTML = `
      <div class="ai-msg-header">
        <span class="ai-avatar-badge">
          <span class="avatar-dot pulse"></span>
          MUZAI
        </span>
        <span class="ai-timestamp">Thinking...</span>
      </div>
      <div class="msg-bubble ai-bubble thinking-bubble">
        <span class="think-dot"></span>
        <span class="think-dot"></span>
        <span class="think-dot"></span>
      </div>
    `;

    chatMessages.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  function removeThinkingIndicator() {
    const el = document.getElementById("thinkingIndicator");
    if (el) el.remove();
  }

  /**
   * Render Suggestion Chips
   */
  function renderSuggestions(suggestionsArray) {
    if (!suggestionsBox) return;
    suggestionsBox.innerHTML = "";

    suggestionsArray.forEach(q => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "suggestion-chip";
      chip.innerHTML = `<span>${q}</span> <span class="chip-arrow">↗</span>`;
      chip.addEventListener("click", () => {
        sendQuery(q);
      });
      suggestionsBox.appendChild(chip);
    });
  }

  /**
   * Send Query Pipeline
   */
  async function sendQuery(queryText) {
    const text = (queryText || chatInput.value || "").trim();
    if (!text) return;

    // Reset input box & resize height
    chatInput.value = "";
    chatInput.style.height = "auto";
    chatInput.focus();

    // Disable input while resolving
    chatInput.disabled = true;
    sendBtn.disabled = true;

    // 1. Append User Message
    appendUserMessage(text);

    // 2. Show brief thinking indicator
    showThinkingIndicator();

    // Small tactile micro-delay for realistic interface polish (180ms)
    await new Promise(r => setTimeout(r, 180));

    // 3. Query knowledge retrieval engine
    const response = await engine.ask(text);

    // 4. Remove indicator and render AI answer
    removeThinkingIndicator();
    appendAIMessage(response);

    // Re-enable input
    chatInput.disabled = false;
    sendBtn.disabled = false;
    chatInput.focus();
  }

  /**
   * Reset / Clear Conversation
   */
  function resetConversation() {
    chatMessages.innerHTML = `
      <div class="chat-welcome-banner">
        <div class="welcome-badge">
          <span class="welcome-dot"></span>
          <span>SYSTEM // READY</span>
        </div>
        <h2 class="welcome-title">Hey. I'm <span class="gradient-text">MuzAI</span>.</h2>
        <p class="welcome-desc">
          I'm an intelligence layer trained on Rohit's projects, technical architectures, skills, and current builds.<br>
          What would you like to explore?
        </p>
      </div>
    `;
    renderSuggestions(initialSuggestions);
    scrollToBottom(false);
  }

  // --- Event Listeners ---

  // Input auto-resize
  chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
  });

  // Keyboard shortcut: Enter to send, Shift+Enter for newline
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuery();
    }
  });

  // Send button click
  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sendQuery();
  });

  // Clear button click
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      resetConversation();
    });
  }

  // Initial Boot
  resetConversation();
});
