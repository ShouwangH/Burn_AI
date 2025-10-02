import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { useScreenSze} from '../src/utils/screenSize'

const size = useScreenSize()

const imagePrompt = "sepia, slight vignette, low saturation, period lighting"

const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: imagePrompt,
  size: '1024x1024',
  aspectRatio: size,
  n: 6
});

