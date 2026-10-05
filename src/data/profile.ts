/* ====== INFO MO (isang lugar lang) ======
   Palitan dito ang pangalan, email, at social links.
   Ginagamit ito ng Hero, Navbar (menu sa phone), at Contact,
   kaya hindi na kailangang i-edit isa-isa.
*/
import type { IconType } from 'react-icons'
import { FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { FiMail } from 'react-icons/fi'

export const NAME = 'Edzel'
export const ROLE = 'Full Stack'
export const EMAIL = 'edzel.wcc@gmail.com'

export type Social = { label: string; href: string; icon: IconType }

export const socials: Social[] = [
  { label: 'GitHub', href: 'https://github.com/xenutheflock', icon: FaGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/edzel-wcc-40769a407/', icon: FaLinkedinIn },
  { label: 'Facebook', href: 'https://www.facebook.com/idzill', icon: FaFacebookF },
  { label: 'Email', href: `mailto:${EMAIL}`, icon: FiMail },
]

// Mga link papunta sa ibang site: bubukas sa bagong tab.
// Ang mailto (email) ay hindi, para walang matirang blangkong tab.
export function linkProps(href: string) {
  return href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer' }
}
