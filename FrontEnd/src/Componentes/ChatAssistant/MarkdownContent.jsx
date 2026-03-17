import React from 'react';

const MarkdownContent = ({ content }) => {
  // Procesa el contenido markdown y lo convierte en JSX formateado
  const parseMarkdown = (text) => {
    const lines = text.split('\n');
    const elements = [];

    const processInline = (text) => {
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="md-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
    };

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Headers
      if (trimmedLine.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="md-h3">
            {processInline(trimmedLine.slice(4))}
          </h3>
        );
        i++;
        continue;
      }
      if (trimmedLine.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className="md-h2">
            {processInline(trimmedLine.slice(3))}
          </h2>
        );
        i++;
        continue;
      }
      if (trimmedLine.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${i}`} className="md-h1">
            {processInline(trimmedLine.slice(2))}
          </h1>
        );
        i++;
        continue;
      }

      // Listas
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const list = [];
        while (i < lines.length) {
          const listLine = lines[i].trim();
          if (!listLine.startsWith('- ') && !listLine.startsWith('* ')) break;
          
          const itemText = listLine.replace(/^[-*]\s+/, '');
          list.push(
            <li key={`li-${i}`} className="md-list-item">
              {processInline(itemText)}
            </li>
          );
          i++;
        }
        if (list.length > 0) {
          elements.push(
            <ul key={`ul-${elements.length}`} className="md-list">
              {list}
            </ul>
          );
        }
        continue;
      }

      // Líneas vacías
      if (trimmedLine === '') {
        elements.push(<div key={`space-${i}`} className="md-spacer" />);
        i++;
        continue;
      }

      // Párrafos normales
      if (trimmedLine.length > 0) {
        elements.push(
          <p key={`p-${i}`} className="md-paragraph">
            {processInline(trimmedLine)}
          </p>
        );
      }

      i++;
    }

    return elements.length > 0 ? elements : text;
  };

  return <div className="markdown-content">{parseMarkdown(content)}</div>;
};

export default MarkdownContent;
