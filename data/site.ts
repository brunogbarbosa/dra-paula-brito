export type Procedure = { name: string; description: string; image: string };
export type Testimonial = { quote: string; name: string };
export const site = {
  name: 'Paula Brito', monogram: 'PB', headline: 'A beleza de ser você.', cro: 'CRO 12935',
  bio: 'Um olhar atento aos seus traços, à sua expressão e ao que faz sentido para você. A Dra. Paula Brito atua com harmonização facial em Recife e Surubim, com foco em valorizar a beleza natural e o equilíbrio do perfil.',
  education: [] as string[], specialties: ['Harmonização facial', 'Perfiloplastia'],
  phone: '', whatsapp: '', whatsappUrl: 'https://wa.me/message/Z7WMMEYKECDDD1',
  address: 'Recife e Surubim · Pernambuco', professionalPhilosophy: 'Realçando a sua beleza natural.',
  instagram: 'https://www.instagram.com/drapaulabrito_/', instagramHandle: '@drapaulabrito_',
  philosophy: ['BELEZA', 'COM', 'IDENTIDADE.'],
  colors: { paper: '#f6f2ea', ink: '#352c27', taupe: '#786856', champagne: '#c3a77b', dark: '#2d2823' },
  images: { hero: '/images/paula-clinica.webp', about: '/images/paula-sorriso.webp', beauty: '/images/paula-cuidado.webp' },
  procedures: [
    { name: 'Perfiloplastia', description: 'Um olhar para a relação entre nariz, lábios e mento, respeitando as proporções do seu rosto.', image: '/images/resultado-perfil.webp' },
    { name: 'Preenchimento labial', description: 'Contorno e proporção em um planejamento que considera o desenho natural dos seus lábios.', image: '/images/resultado-labios.webp' },
    { name: 'Rejuvenescimento facial', description: 'Possibilidades de cuidado pensadas a partir da sua expressão e das necessidades da sua pele.', image: '/images/paula-cuidado.webp' },
  ] as Procedure[],
  office: [] as { src: string; alt: string }[], testimonials: [] as Testimonial[],
  results: { enabled: true, items: [
    { image: '/images/resultado-equilibrio.webp', label: 'Equilíbrio e expressão', alt: 'Registro de antes e depois enviado para o portfólio da Dra. Paula Brito', orientation: 'horizontal', beforeShare: .5, comparisonRatio: 642/1284 },
    { image: '/images/resultado-perfil.webp', label: 'Harmonia do perfil', alt: 'Comparação lateral do perfil facial, registro da Dra. Paula Brito', orientation: 'horizontal', beforeShare: 657/1284, comparisonRatio: 642/1272 },
    { image: '/images/resultado-labios.webp', label: 'Delicadeza nos contornos', alt: 'Comparação dos lábios em fotografia clínica da Dra. Paula Brito', orientation: 'horizontal', beforeShare: 647/1284, comparisonRatio: 642/1289 },
    { image: '/images/resultado-harmonia.webp', label: 'Proporções que conversam', alt: 'Antes e depois do perfil facial, fotografia enviada pela Dra. Paula Brito', orientation: 'horizontal', beforeShare: 657/1284, comparisonRatio: 642/1276 },
    { image: '/images/resultado-expressao.webp', label: 'Beleza com identidade', alt: 'Dois registros da expressão facial, portfólio da Dra. Paula Brito', orientation: 'horizontal', beforeShare: 655/1284, comparisonRatio: 642/1295 },
    { image: '/images/resultado-contorno.webp', label: 'Um olhar para o detalhe', alt: 'Detalhe dos lábios em registro clínico da Dra. Paula Brito', orientation: 'single', beforeShare: .5, comparisonRatio: 1284/1320 },
    { image: '/images/resultado-detalhe.webp', label: 'Desenho e delicadeza', alt: 'Fotografia dos lábios, portfólio da Dra. Paula Brito', orientation: 'single', beforeShare: .5, comparisonRatio: 1284/1279 },
  ] },
  seo: { title: 'Dra. Paula Brito | Harmonização Facial em Recife e Surubim', description: 'Realçando a sua beleza natural. Conheça o olhar da Dra. Paula Brito para harmonização facial e perfiloplastia em Recife e Surubim. CRO 12935.', url: process.env.NEXT_PUBLIC_SITE_URL || '' },
};
export const appointmentUrl = site.whatsappUrl || (site.whatsapp ? `https://wa.me/${site.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent('Olá, gostaria de agendar uma avaliação com a Dra. Paula Brito.')}` : site.instagram);
