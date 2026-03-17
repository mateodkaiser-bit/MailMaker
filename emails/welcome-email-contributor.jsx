import { Html, Head, Body, Container, Text, Section, Column, Img } from '@react-email/components';

export const subject = "A personal thanks for joining Swarmed";

export default function WelcomeEmailContributor({
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
        dangerouslySetInnerHTML={{ __html: "I’m Mateo, a fifth-generation beekeeper and master beekeeper. Thank you for joining our community of beekeepers!" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "I built Swarmed with one goal: to make it easier for people to report swarms and for beekeepers like us to respond quickly." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Thousands of beekeepers are now using Swarmed every day to catch swarms across North America and Australia. Plus, we're using the anonymous swarm data we collect to help advance honey bee health research. Here's a bit more about what we're doing:" }}
      />
      <Section>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Img
            src="https://img.mailinblue.com/8333748/images/content_library/original/680be4b937a8c0a38c87b313.png"
            alt=""
            width="100px"
            style={{ display: 'block', margin: '0 auto' }}
          />
        </Column>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Text
            style={{ fontSize: '24px', fontWeight: 700, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
            dangerouslySetInnerHTML={{ __html: "Getting 10,000 swarms a year into beekeeper's hives" }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "We're the only group out there running digital ads and working to game the search algorithms to get more swarm reports to you." }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "<br/>" }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "We also work with nonprofits, municipalities, libraries, emergency dispatch services, and <a href=\"http://beeswarmed.org/partnerships\">beekeeping associations</a> worldwide to get more swarms reported to beekeepers." }}
          />
        </Column>
      </Section>
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "If you’d like to get more involved, you're also welcome to join our <a href=\"https://www.facebook.com/groups/804877638183767\">Bee Swarm Catching Community</a> on Facebook, <a href=\"https://www.facebook.com/people/Swarmed-Swarm-Reporting/61557443426206/\">follow Swarmed</a>, and help <a href=\"http://beeswarmed.org/spread-the-buzz\">spread the buzz</a> by sharing this service with other beekeepers and your wider community." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "If you have any questions, check out our <a href=\"https://beeswarmed.notion.site/\">FAQ/Wiki page</a> or feel free to reach out to me directly." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Thanks for joining!" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Best,<br/>Mateo" }}
      />
        </Container>
      </Body>
    </Html>
  );
}
