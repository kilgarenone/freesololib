import Mermaid from "mermaid";
import Murmur from "./murmurhash";

const MermaidChart = (code) => {
  try {
    const needsUniqueId = "render" + Murmur(code, 31).toString();
    Mermaid.mermaidAPI.render(needsUniqueId, code, (sc) => {
      code = sc;
    });
    return `<div class="mermaid">${code}</div>`;
  } catch (err) {
    return `<pre>${htmlEntities(err.name)}: ${htmlEntities(err.message)}</pre>`;
  }
};

const MermaidPlugIn = (md, opts) => {
  Mermaid.initialize({
    startOnLoad: false,
  });

  const defaultRenderer = md.renderer.rules.fence.bind(md.renderer.rules);

  function replacer(_, p1, p2, p3) {
    p1 = dictionary[p1] ?? p1;
    p2 = dictionary[p2] ?? p2;
    return p2 === "" ? `${p1}\n` : `${p1} ${p2}${p3}`;
  }

  md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
    const token = tokens[idx];
    const code = token.content.trim();
    if (token.info.trim() === "mermaid") {
      return MermaidChart(code.replace(/(.*?)[ \n](.*?)([ \n])/, replacer));
    }
    return defaultRenderer(tokens, idx, opts, env, self);
  };
};

export default MermaidPlugIn;
