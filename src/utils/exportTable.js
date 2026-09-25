/**
 * Utilitas untuk mengonversi data tabel ke format Markdown atau CSV/TSV
 * agar mahasiswa mudah menyalin ke catatan atau lembar kerja.
 */

export function convertToMarkdown(headers, rows) {
  const headerLine = `| ${headers.join(' | ')} |`;
  const separatorLine = `| ${headers.map(() => '---').join(' | ')} |`;
  const dataLines = rows.map((row) => `| ${row.join(' | ')} |`).join('\n');
  return `${headerLine}\n${separatorLine}\n${dataLines}`;
}

export function convertToCSV(headers, rows, delimiter = '\t') {
  const headerLine = headers.join(delimiter);
  const dataLines = rows.map((row) => row.join(delimiter)).join('\n');
  return `${headerLine}\n${dataLines}`;
}

export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback untuk lingkungan non-secure
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    }
  } catch (err) {
    console.error('Gagal menyalin:', err);
    return false;
  }
}
