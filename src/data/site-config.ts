import avatar from '../assets/images/avatar.jpg';
import hero from '../assets/images/hero.jpg';
import type { SiteConfig } from '../types';

const siteConfig: SiteConfig = {
    website: 'https://nicolasrincon757-glitch.github.io',
    avatar: {
        src: avatar,
        alt: 'Ethan Donovan'
    },
    title: 'Nicolás Santiago Rincón Colorado',
    subtitle: 'Blog & Portafolio',
    description: 'Pagina dedicada a documentar mis proyectos',
    image: {
        src: '/dante-preview.jpg',
        alt: 'Dante - Astro.js and Tailwind CSS theme'
    },
    headerNavLinks: [
        {
            text: 'Inicio',
            href: '/'
        },
        {
            text: 'Projectos',
            href: '/projects'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Contact',
            href: '/contact'
        },
        {
            text: 'Terms',
            href: '/terms'
        },
        {
            text: 'Download theme',
            href: 'https://github.com/JustGoodUI/dante-astro-theme'
        }
    ],
    socialLinks: [
        {
            text: 'Facebook',
            href: 'https://facebook.com/'
        },
        {
            text: 'Instagram',
            href: 'https://instagram.com/'
        },
        {
            text: 'X/Twitter',
            href: 'https://twitter.com/'
        }
    ],
    hero: {
        title: 'Hola! Bienvenido a mi sitio web :D',
        text: "Hola, mi nombre es Nicolas y esta sera mia pagina dedicada a subir todos mis proyectos relacionados con programacion, asi mismo soy estudiante de Ingenieria de Sistemas en la Universidad El Bosque UEB, tengo 20 años y voy en 4to semestre de la carrera, tengo altas espectativas tanto con el portafolio como con lo que se pueda desarrollar a lo largo de este curso.",
        image: {
            src: hero,
            alt: 'A person sitting at a desk in front of a computer'
        },
        actions: [
            {
                text: 'Get in Touch',
                href: '/contact'
            }
        ]
    },
    subscribe: {
        enabled: true,
        title: 'Juntoooos, caminemos juntoooos',
        text: 'Tratare de mantenerlo actualizado, o eso espero.',
        form: {
            action: '#'
        }
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
