# OCR

It's a basic ocr process, a user input a image and the application return a text file with all text inner image.

The application has 2 main OCR: tesseract and 3-Third party ocr. The application is not dependent of any 3-Third party service, so every external service is wrapped in adpater class in `/lib` folder.

The main OCR Service should be the 3-party one's but, in local development or when the external service is not working (for billing or infraestructure problems) should use Tesseract service.

## Use Cases

a user send an image the application:

1. validate that is a valid image
2. validate image size: 100MB max
3. process image: contrast, gray-scale etc.
4. run ocr
5. return `.txt` file to user

> OBSERVATION: In the last update of docs (20/04/2026), the 3-party service used for OCR is Google Vision
