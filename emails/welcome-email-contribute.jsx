import { Html, Head, Body, Container, Text, Section, Column, Img, Link } from '@react-email/components';

export const subject = "A personal thanks for joining Swarmed";

export default function WelcomeEmailContribute({
  beekeepername = "Jane Doe",
} = {}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: `Dear ${beekeepername},` }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "I’m Mateo, a fifth-generation beekeeper and certified master beekeeper. Thank you for joining our community of thousands of beekeepers responding to swarms!" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "We're the only beekeepers out there using search algorithms to get more swarms to you, not exterminators." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "We also work with nonprofits, municipalities, libraries, emergency dispatch services, and <a href=\"http://beeswarmed.org/partnerships\">beekeeping associations</a> worldwide to get more swarms reported to beekeepers." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Want to learn more about how Swarmed works? I sat down with Fred Dunn to walk through exactly what we're building for beekeepers. You can watch that conversation <a href=\"https://www.youtube.com/watch?v=NZ29kedeBC0\">here</a>." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "If you’d like to get more involved, you're also welcome to join our <a href=\"https://www.facebook.com/groups/804877638183767\">Bee Swarm Catching Community</a> on Facebook, and help <a href=\"http://beeswarmed.org/spread-the-buzz\">spread the buzz</a> by sharing this service with other beekeepers and your wider community." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "If you have any questions, check out our <a href=\"https://beeswarmed.notion.site/\">FAQ/Wiki page</a> or feel free to reach out to me directly." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Thanks again for joining!" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Best,<br/>Mateo from Swarmed" }}
      />
      <Section>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "Swarmed depends on the support of beekeepers through pay-what-you-want contributions. " }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "<br/>" }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "Please consider supporting our work by clicking the link below or going logging in and going to <a href=\"https://beeswarmed.org/settings?tab=subscription\">Settings &gt; Manage Plan</a>." }}
          />
        </Column>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Link href="https://beeswarmed.org/settings?tab=subscription">
            <Img
              src="https://img.mailinblue.com/8333748/images/content_library/original/6991e540967965b35ca4f890.png"
              alt=""
              width="100px"
              style={{ display: 'block', margin: '0 auto' }}
            />
          </Link>
        </Column>
      </Section>
        </Container>
      </Body>
    </Html>
  );
}
