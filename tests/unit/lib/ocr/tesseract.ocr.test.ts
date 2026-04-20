import { TesseractOCR } from '@/lib/ocr/tesseract.ocr';
import { createWorker } from 'tesseract.js';

jest.mock('tesseract.js');

describe('TesseractOCR', () => {
  let tesseractOCR: TesseractOCR;
  const mockWorker = {
    recognize: jest.fn(),
    terminate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createWorker as jest.Mock).mockResolvedValue(mockWorker);
    tesseractOCR = new TesseractOCR();
  });

  it('With a valid image buffer, it returns extracted text', async () => {
    const imageBuffer = Buffer.from('dummy');
    mockWorker.recognize.mockResolvedValue({
      data: { text: 'Mocked text' },
    });

    const result = await tesseractOCR.recognize(imageBuffer);

    expect(result).toBe('Mocked text');
    expect(createWorker).toHaveBeenCalledWith('por');
    expect(mockWorker.recognize).toHaveBeenCalledWith(imageBuffer);
    expect(mockWorker.terminate).toHaveBeenCalled();
  });
});
