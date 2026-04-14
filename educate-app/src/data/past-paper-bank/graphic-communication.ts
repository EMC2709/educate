import type { Question } from '@/types';

export const graphicCommunicationPastPaper: Question[] = [
  {
    topic: "Design Principles – Visual Hierarchy",
    question: "Explain how a graphic designer uses visual hierarchy to guide the viewer's eye through a page layout. Give three techniques used to establish hierarchy.",
    answer: "Visual hierarchy is the arrangement of graphic elements in order of importance, guiding the viewer in a deliberate sequence.\n\nTechnique 1: Scale and size — the largest element draws the eye first. A bold, oversized headline establishes the primary message; body text is smaller to indicate secondary importance.\n\nTechnique 2: Contrast — differences in colour, weight, or tone create focal points. A bright call-to-action button against a neutral background immediately stands out. Bold type contrasted with regular weight distinguishes headings.\n\nTechnique 3: Position and spacing — elements placed at the top-left of a layout (in Western cultures) are read first. White space around an element increases its prominence. Key content placed along Z-pattern or F-pattern reading paths is seen first.\n\nOther valid techniques: colour saturation, typography style, alignment breaks, imagery placement.",
    marks: 6,
    hint: "Define hierarchy first, then give three distinct techniques. For each, explain the principle and give a practical design example.",
  },
  {
    topic: "Technical Drawing – Orthographic Projection",
    question: "Explain the difference between first angle and third angle orthographic projection. State which projection is typically used in the UK and describe the symbols used to identify each.",
    answer: "Orthographic projection represents a 3D object as a set of 2D views drawn at right angles to each other.\n\nFirst angle: the object is between the viewer and the projection plane. Each view shows what you see if you look through the object onto the plane behind it. Plan (top view) is placed BELOW the front elevation; side view is placed on the OPPOSITE side to the viewing direction.\n\nThird angle: the projection plane is between the viewer and the object. Each view is on the same side as the direction of viewing. Plan is placed ABOVE the front elevation; side view is on the SAME side as the viewing direction.\n\nUK practice: Third angle projection is the more common standard in UK education and industry (BS 8888). First angle is common in mainland Europe. The projection symbol (truncated cone in two views) must always be shown — third angle has the smaller circle on the viewer's side.",
    marks: 4,
    hint: "Explain where the plan and side views are placed relative to the front elevation for each. State which is standard in the UK and describe the symbols.",
  },
  {
    topic: "Design Process – Brand Identity",
    question: "Describe the stages of the design process a graphic designer would follow when creating a new brand identity for a client. Explain what happens at each stage.",
    answer: "1. Research and brief analysis — study the brief, target audience, competitors, and market position. Create mood boards to explore visual directions.\n\n2. Idea generation — pencil sketches and thumbnails exploring typographic, symbolic, abstract, and combination marks. Mind maps and annotation explain the thinking.\n\n3. Digital development — develop the strongest 2-3 concepts digitally (Adobe Illustrator). Refine logo, typography, colour palette (Pantone/CMYK values), and apply across mock-ups.\n\n4. Client feedback — present options with rationale, gather feedback, iterate through revisions.\n\n5. Final production — test at all sizes and in monochrome. Prepare vector files (AI, SVG, EPS, PDF). Create brand guidelines document specifying logo usage, clear space rules, colour values, and typefaces.",
    marks: 8,
    hint: "Follow the stages in order: research → ideas → development → feedback → production. State what the designer DOES and what is PRODUCED at each stage.",
  },
  {
    topic: "Colour Theory",
    question: "Explain the importance of colour theory in graphic design. Describe the difference between complementary and analogous colour schemes and suggest when each might be used.",
    answer: "Colour theory provides a framework for selecting and combining colours effectively. Colour communicates mood, attracts attention, creates unity, and influences emotional response. Poor colour choices make designs confusing or inaccessible.\n\nComplementary: colours directly opposite on the colour wheel (e.g. red/green, blue/orange). Create maximum contrast and visual vibrancy — each colour makes the other appear more saturated. Use when impact and energy are needed: sale posters, sports branding, call-to-action buttons. Caution: full-saturation complementary colours in large areas can be visually aggressive; typically one colour dominates.\n\nAnalogous: colours adjacent on the colour wheel (e.g. blue, blue-green, green). Inherently harmonious — colours share underlying hues. Use when calm, cohesion, and sophistication are needed: wellness branding, nature themes, editorial layouts. Often requires a neutral or small contrasting accent to provide a focal point.",
    marks: 6,
    hint: "Define each scheme using the colour wheel with specific examples. Suggest appropriate design contexts for each. Consider accessibility and colour contrast.",
  },
  {
    topic: "Technical Drawing – Line Types",
    question: "Explain the purpose of the following line types used in technical drawings:\n(a) Continuous thick line\n(b) Dashed thin line\n(c) Chain thin line\n(d) Continuous thin line",
    answer: "(a) Continuous thick line — visible outlines and edges. Defines the shape of the object as seen from the viewing direction. Typically 0.7mm line weight.\n\n(b) Dashed thin line (hidden detail) — edges hidden behind visible surfaces. Example: a drilled hole not visible from the current view is shown as dashes.\n\n(c) Chain thin line (centre line) — indicates the centre of circular features and lines of symmetry. Drawn as long dash, short dash. Centre lines extend slightly beyond the feature. Essential for dimensioning circular features.\n\n(d) Continuous thin line — dimension lines, extension (projection) lines, hatching in section views, leader lines, and construction lines. Supporting lines adding information without defining object shape. Clearly thinner than outlines.",
    marks: 4,
    hint: "For each line type, state what it represents and when it is used. Use correct terminology (visible outline, hidden detail, centre line, dimension line).",
  },
  {
    topic: "Design Process – Evaluation",
    question: "Explain two methods a designer can use to evaluate the success of a finished graphic design product.",
    answer: "Method 1: Testing against the design brief and specification — systematically check that the final product meets every requirement: Does it communicate the intended message? Is it suitable for the target audience? Does it work at all required sizes? Are the correct file formats and colour modes provided? Does it meet accessibility standards (WCAG minimum 4.5:1 colour contrast ratio for text)? This is objective evaluation measured against defined criteria.\n\nMethod 2: User testing and feedback — show the design to a sample of the target audience. Focus groups (qualitative discussion), A/B testing (showing two variations to compare performance), or surveys (Likert-scale questions). User testing reveals whether the design works in practice — a designer may assume hierarchy is clear, but testing might show users miss the call-to-action. Analytics (click-through rates, conversion rates) can evaluate digital designs quantitatively.",
    marks: 4,
    hint: "Name two distinct methods. For each, explain what it involves and what kind of feedback it provides. Consider both objective (against brief) and subjective (user response) evaluation.",
  },
  {
    topic: "Typography",
    question: "Explain the role of typography in graphic design. Describe two factors a designer should consider when selecting a typeface for a body of text.",
    answer: "Typography is the art of arranging type to make written language legible, readable, and visually appealing. Typography communicates tone and brand personality before words are read — a formal serif typeface conveys authority; a rounded sans-serif suggests friendliness.\n\nFactor 1: Legibility and readability — the typeface must be easy to read at the intended size and medium. For body text, a clear x-height, open counters, and consistent letter-spacing are essential. Serif typefaces are traditionally favoured for printed body text; sans-serif for screens. Line length (45-75 characters), leading (120-145% of type size), and tracking all affect readability.\n\nFactor 2: Appropriateness to context and audience — the typeface must suit the subject matter, brand, and target audience. A children's book uses a friendly rounded sans-serif with single-storey 'a' and 'g'. A luxury brand uses a refined high-contrast serif. The typeface must also provide the required weights and styles (regular, bold, italic) for typographic variety.",
    marks: 4,
    hint: "Explain why typography matters beyond carrying words. Then cover two considerations — legibility, context, audience, brand, or technical requirements.",
  },
  {
    topic: "CAD/CAM and Printing",
    question: "Describe the differences between vector and raster graphics. Explain why each type is appropriate for different design tasks and state two file formats for each.",
    answer: "Vector graphics use mathematical equations (paths, points, curves) to define shapes. They are resolution-independent — they scale infinitely without any loss of quality because the maths is recalculated at every size. Ideal for: logos, icons, illustrations, typography, technical drawings. File formats: SVG (Scalable Vector Graphics), AI (Adobe Illustrator), EPS (Encapsulated PostScript).\n\nRaster (bitmap) graphics are composed of a fixed grid of pixels, each with a defined colour. They are resolution-dependent — enlarging a raster image stretches the existing pixels, causing pixelation. Ideal for: photographs, complex imagery with tonal gradients, screen-based designs. File formats: JPEG (compressed, lossy — ideal for photographs), PNG (lossless compression, supports transparency — ideal for logos on web), TIFF (lossless, high quality for print photography), GIF (limited palette, supports simple animation).\n\nKey distinction for design practice: a company logo must always be created as a vector; a product photograph must be raster — attempting to use a 72 PPI raster logo on a billboard will result in a heavily pixelated, unprofessional result.",
    marks: 5,
    hint: "Define each type, explain the quality difference when scaled, state what each is best used for, and give file format examples.",
  },
  {
    topic: "Design Communication – Packaging",
    question: "Explain the key design considerations when creating packaging for a food product. Your answer should include visual design, materials, legal requirements, and sustainability.",
    answer: "Visual design: the packaging must attract the target audience on the shelf — hierarchy of information (brand name, product name, flavour/variant most prominent), consistent brand identity (logo, colour palette, typeface), and imagery that represents the product honestly and appetisingly. Must work in 3D — visible on multiple faces.\n\nMaterials: food-safe materials are mandatory (food-grade card, plastic, or foil depending on product). Must protect the product from contamination and damage during transit. Material choice affects: cost, weight, stackability, and sustainability.\n\nLegal requirements: mandatory information must be included (UK Food Information Regulation): ingredients list (in descending weight order), allergens (bold/highlighted), net weight, nutritional information per 100g, best before/use by date, storage instructions, manufacturer name and address, barcode/EAN, recycling information.\n\nSustainability: use recycled or recyclable materials; minimise material quantity (lightweighting); avoid mixed-material packaging that cannot be separated for recycling; use soy-based inks; clearly communicate recycling instructions to the consumer.",
    marks: 6,
    hint: "Cover all four areas: visual design, materials, legal requirements (list what must appear), and sustainability. Give specific examples for each.",
  },
  {
    topic: "Design History – Design Movements",
    question: "Describe the visual characteristics of the Bauhaus design movement. Explain how its principles continue to influence graphic design today.",
    answer: "The Bauhaus was a German art and design school (1919-1933) founded by Walter Gropius. Its central philosophy was 'form follows function' — design should be determined by purpose rather than decoration. Key visual characteristics: geometric shapes (circles, squares, triangles as primary building blocks); primary colour palettes (red, yellow, blue, black); sans-serif typography (universal type, later Futura); grid-based layouts with strong mathematical structure; asymmetric composition; integration of fine art, craft, and industrial production. Key figures: Herbert Bayer (typography), László Moholy-Nagy (photography and typography), Marcel Breuer (furniture).\n\nInfluence on contemporary design: Swiss/International Style directly evolved from Bauhaus principles. Modern UI/UX design applies Bauhaus functionalism — interfaces should be intuitive and uncluttered. Corporate identity and wayfinding systems use the grid and geometric simplicity of Bauhaus. The emphasis on whitespace, alignment, and typographic hierarchy in modern graphic design all trace back to Bauhaus teaching. Many sans-serif typefaces in widespread use (Futura, Helvetica) are rooted in Bauhaus type design philosophy.",
    marks: 6,
    hint: "Describe the visual style (shapes, colours, typography, composition) and the philosophy. Then give at least three specific examples of how these principles appear in design today.",
  },
];
