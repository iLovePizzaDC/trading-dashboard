import { downloadFile } from '@/features/header/utils/download-dropdown';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('downloadFile', () => {
  let createObjectURLSpy: ReturnType<typeof vi.fn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>;
  let clickSpy: ReturnType<typeof vi.fn<() => void>>;
  const fakeBlob = new Blob(['content'], { type: 'text/plain' });

  beforeEach(() => {
    createObjectURLSpy = vi.fn().mockReturnValue('blob:mock-url');
    revokeObjectURLSpy = vi.fn();

    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: createObjectURLSpy,
      revokeObjectURL: revokeObjectURLSpy,
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        blob: () => Promise.resolve(fakeBlob),
      }),
    );

    clickSpy = vi.fn(() => { });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(clickSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('fetches the file from the /data/ directory', async () => {
    await downloadFile('report.csv');

    expect(fetch).toHaveBeenCalledWith('/data/report.csv');
  });

  it('creates an object URL from the fetched blob', async () => {
    await downloadFile('report.csv');

    expect(createObjectURLSpy).toHaveBeenCalledWith(fakeBlob);
  });

  it('sets the anchor href to the created object URL', async () => {
    let capturedHref = '';
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') {
        Object.defineProperty(el, 'href', {
          set(value: string) {
            capturedHref = value;
          },
          get() {
            return capturedHref;
          },
        });
      }
      return el;
    });

    await downloadFile('report.csv');

    expect(capturedHref).toBe('blob:mock-url');
  });

  it('sets the anchor download attribute to the given filename', async () => {
    let capturedDownload = '';
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') {
        Object.defineProperty(el, 'download', {
          set(value: string) {
            capturedDownload = value;
          },
          get() {
            return capturedDownload;
          },
        });
      }
      return el;
    });

    await downloadFile('report.csv');

    expect(capturedDownload).toBe('report.csv');
  });

  it('triggers a click on the created anchor element', async () => {
    await downloadFile('report.csv');

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('revokes the object URL after triggering the download', async () => {
    await downloadFile('report.csv');

    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
  });

  it('revokes the object URL after clicking (correct order)', async () => {
    const callOrder: string[] = [];
    clickSpy.mockImplementation(() => {
      callOrder.push('click');
    });
    revokeObjectURLSpy.mockImplementation(() => {
      callOrder.push('revoke');
    });

    await downloadFile('report.csv');

    expect(callOrder).toEqual(['click', 'revoke']);
  });
});
