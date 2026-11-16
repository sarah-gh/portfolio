import { EDUCATION, LANGUAGES, SKILL_GROUPS } from '~/constants/profile'
import { SITE, SOCIAL_LINKS } from '~/constants/site'

/**
 * Adds schema.org structured data (ProfilePage + Person + WebSite) to the page.
 * This tells Google that the site belongs to the person "Sara Ghotbzadeh" and links it
 * to her GitHub and LinkedIn profiles (sameAs), which helps with name searches.
 */
export function usePersonSchema() {
  const absolute = useAbsoluteUrl()
  const home = absolute('/')

  const person = {
    '@type': 'Person',
    '@id': `${home}#person`,
    'name': SITE.name,
    'givenName': SITE.givenName,
    'familyName': SITE.familyName,
    'jobTitle': SITE.role,
    'description': SITE.homeDescription,
    'url': home,
    'image': absolute(SITE.ogImage),
    'email': `mailto:${SITE.email}`,
    'address': { '@type': 'PostalAddress', 'addressLocality': 'Tokyo', 'addressCountry': 'JP' },
    'sameAs': SOCIAL_LINKS.map(link => link.href),
    'knowsAbout': SKILL_GROUPS.slice(0, 3).flatMap(group => group.skills),
    'knowsLanguage': LANGUAGES.map(language => language.name),
    'alumniOf': EDUCATION.map(item => ({ '@type': 'CollegeOrUniversity', 'name': item.school })),
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${home}#profile`,
        'url': home,
        'name': SITE.homeTitle,
        'mainEntity': { '@id': person['@id'] },
      },
      person,
      {
        '@type': 'WebSite',
        '@id': `${home}#website`,
        'url': home,
        'name': SITE.name,
        'author': { '@id': person['@id'] },
        'inLanguage': 'en',
      },
    ],
  }

  useHead({
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(graph) }],
  })
}
