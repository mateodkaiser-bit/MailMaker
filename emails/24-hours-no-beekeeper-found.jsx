import { Html, Head, Body, Container, Img, Link, Section, Column, Text, Row } from '@react-email/components';

export const subject = "No Beekeeper Available for Your Report";

export default function 24HoursNoBeekeeperFound({
  swarmimage = "https://swarmwatch.example.org/images/swarm-456.jpg",
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
            dangerouslySetInnerHTML={{ __html: "We’re Sorry – No Beekeeper Was Found" }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "Unfortunately, it looks like none of the beekeepers in your area were able to claim your report this time." }}
          />
        </Column>
      </Section>
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "If the bees are still there, we recommend:" }}
      />
      <Text
        style={{ margin: '0 0 8px 0', paddingLeft: '16px', lineHeight: '1.6', fontSize: '16px', color: '#676a6c' }}
        dangerouslySetInnerHTML={{ __html: "1. <strong>Contacting your local beekeeping association</strong> to see if they can assist with your specific situation.<br/>2. <strong>Trying again on Swarmed</strong>. Adding a clearer or closer photo of the swarm can often help attract a beekeeper, as it gives them a better sense of the situation." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "We’re sorry we couldn’t connect you with a beekeeper right now, but thank you for using Swarmed to help protect honey bees." }}
      />
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
      <Section>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Link href="https://beeswarmed.org/">
            <Img
              src="https://img.mailinblue.com/8333748/images/content_library/original/673f42266d8c7e0c4e5bf738.png"
              alt=""
              width="300px"
              style={{ display: 'block', margin: '0 auto' }}
            />
          </Link>
        </Column>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Row style={{ textAlign: 'center', margin: '8px 0' }}>
            <Link href="https://www.instagram.com/beeswarmed/" style={{ display: 'inline-block', margin: '0 6px' }}>
              <Img src="https://creative-assets.mailinblue.com/editor/social-icons/original_bw/instagram_32px.png" alt="instagram" width="24" height="24" />
            </Link>
            <Link href="https://www.facebook.com/people/Swarmed-Swarm-Reporting/61557443426206/" style={{ display: 'inline-block', margin: '0 6px' }}>
              <Img src="https://creative-assets.mailinblue.com/editor/social-icons/original_bw/facebook_32px.png" alt="facebook" width="24" height="24" />
            </Link>
          </Row>
        </Column>
      </Section>
        </Container>
      </Body>
    </Html>
  );
}
