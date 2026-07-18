export async function downloadFile(file: string) {
  const res = await fetch(`/data/${file}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = file;
  a.click();

  URL.revokeObjectURL(url);
}
