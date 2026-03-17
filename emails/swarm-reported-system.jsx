import { Html, Head, Body, Container, Img, Link, Section, Column, Text } from '@react-email/components';

export const subject = "A Colony Was Reported in Illinois";

export default function SwarmReportedSystem({
  swarmimage = "https://swarmwatch.example.org/images/swarm-456.jpg",
  swarmcity = "Springfield",
  swarmsize = "Medium (basketball-sized)",
  situation = "Swarm is hanging on a low oak branch, about 4 feet off the ground",
  swarmheight = "4 feet",
  swarmduration = "2 days",
  beekeepernumber = "+1 (555) 234-5678",
  swarmassociation = "Midwest Beekeepers Association",
  associationlogo = "https://swarmwatch.example.org/assets/logo.png",
  associationlink = "https://swarmwatch.example.org/association",
} = {}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Link href="https://beeswarmed.org/">
        <Img
          src="https://img.mailinblue.com/8333748/images/content_library/original/673f42266d8c7e0c4e5bf738.png"
          alt=""
          width="300px"
          style={{ display: 'block', margin: '0 auto' }}
        />
      </Link>
      <Section>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Img
            src={swarmimage}
            alt=""
            width="270px"
            style={{ display: 'block', margin: '0 auto' }}
          />
        </Column>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Text
            style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
            dangerouslySetInnerHTML={{ __html: `A swarm has been reported in ${swarmcity}` }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: `Size: ${swarmsize}` }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: `Situation: ${situation}` }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: `Height: ${swarmheight}` }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: `Duration: ${swarmduration}` }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: `Beekeepers Notified: ${beekeepernumber}` }}
          />
        </Column>
      </Section>
      <Section>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Text
            style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
            dangerouslySetInnerHTML={{ __html: `This colony was reported via ${swarmassociation}` }}
          />
        </Column>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Link href={associationlink}>
            <Img
              src={associationlogo}
              alt=""
              width="220px"
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
