import { GoogleVisionOCR } from '@/lib/ocr/google-vision.ocr';
import { ImageAnnotatorClient } from '@google-cloud/vision';

jest.mock('@google-cloud/vision');

describe('GoogleVisionOCR', () => {
  let googleVisionOCR: GoogleVisionOCR;
  const mockClient = {
    textDetection: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(ImageAnnotatorClient)
      .mockImplementation(() => mockClient as unknown as ImageAnnotatorClient);
    googleVisionOCR = new GoogleVisionOCR('{"project_id": "test"}');
  });

  it('With a valid image buffer, it returns extracted text (triggers lazy connect)', async () => {
    const imageBuffer = Buffer.from('dummy');
    mockClient.textDetection.mockResolvedValue([
      { fullTextAnnotation: { text: 'Mocked Vision Text' } },
    ]);

    expect(ImageAnnotatorClient).not.toHaveBeenCalled();

    const result = await googleVisionOCR.recognize(imageBuffer);

    expect(result).toBe('Mocked Vision Text');
    expect(ImageAnnotatorClient).toHaveBeenCalledWith({
      credentials: { project_id: 'test' },
    });
    expect(mockClient.textDetection).toHaveBeenCalledWith(imageBuffer);
  });

  it('When called multiple times, it reuses the same client', async () => {
    const imageBuffer = Buffer.from('dummy');
    mockClient.textDetection.mockResolvedValue([{}]);

    await googleVisionOCR.recognize(imageBuffer);
    await googleVisionOCR.recognize(imageBuffer);

    expect(ImageAnnotatorClient).toHaveBeenCalledTimes(1);
  });

  it('When no credentials are provided, it initializes with undefined credentials', async () => {
    const ocrWithoutCreds = new GoogleVisionOCR();
    mockClient.textDetection.mockResolvedValue([{}]);

    await ocrWithoutCreds.recognize(Buffer.from('dummy'));

    expect(ImageAnnotatorClient).toHaveBeenCalledWith({ credentials: undefined });
  });

  it('When no text is detected, returns an empty string', async () => {
    const imageBuffer = Buffer.from('dummy');
    mockClient.textDetection.mockResolvedValue([{}]);

    const result = await googleVisionOCR.recognize(imageBuffer);

    expect(result).toBe('');
  });
});
