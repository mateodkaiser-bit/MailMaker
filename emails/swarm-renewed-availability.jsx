import { Html, Head, Body, Container, Img, Link, Section, Column, Text, Hr, Row } from '@react-email/components';

export const subject = "A nearby report has been made available again.";

export default function SwarmRenewedAvailability({
  swarmimage = "https://swarmwatch.example.org/images/swarm-456.jpg",
  swarmcity = "Springfield",
  swarmdistance = "3.2 miles",
  swarmsize = "Medium (basketball-sized)",
  situation = "Swarm is hanging on a low oak branch, about 4 feet off the ground",
  swarmheight = "4 feet",
  swarmduration = "2 days",
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
            dangerouslySetInnerHTML={{ __html: `A colony that was reported in ${swarmcity} has been made available again.` }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: `${swarmdistance} away` }}
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
            dangerouslySetInnerHTML={{ __html: "For more details or to claim this swarm:" }}
          />
          <Section style={{ padding: '18px 0 0 0', margin: 0 }} />
        </Column>
      </Section>
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "This colony was previously claimed by a beekeeper but has been made available again. This may be because the beekeeper un-claimed it, or because they were skipped by the person who reported the swarm. " }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Now is your chance to claim this swarm for yourself!" }}
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
      <Hr
        style={{ borderColor: '#091747', borderTopWidth: '2px', width: '100%', margin: '16px auto' }}
      />
      <Section>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Text
            style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
            dangerouslySetInnerHTML={{ __html: "Beekeeper Best Practices" }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "If you capture the colony, follow our best practices to make the experience smooth for both the bees and the person who reported them to you." }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "By claiming the bees, you take responsibility for ensuring a safe and successful removal. " }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "Don’t forget to check that your actions comply with all laws and regulations in your area." }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "Good luck!" }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "-Mateo" }}
          />
        </Column>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Img
            src="https://img.mailinblue.com/8333748/images/content_library/original/6748d21bbd06436524dabc2b.png"
            alt=""
            width="270px"
            style={{ display: 'block', margin: '0 auto' }}
          />
        </Column>
      </Section>
      <Img
        src="https://img.mailinblue.com/8333748/images/content_library/original/6748d3d17a538a028e1ef03c.png"
        alt=""
        width="185px"
        style={{ display: 'block', margin: '0 auto' }}
      />
      <Text
        style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
        dangerouslySetInnerHTML={{ __html: "Respond Promptly" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "When you claim a report, be sure to message the person promptly to make a plan to pick up the swarm so that they know they are in good hands." }}
      />
      <Img
        src="https://img.mailinblue.com/8333748/images/content_library/original/6748d465bd06436524dabc9d.png"
        alt=""
        width="185px"
        style={{ display: 'block', margin: '0 auto' }}
      />
      <Text
        style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
        dangerouslySetInnerHTML={{ __html: "Set Expectations" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Swarm captures are typically free of charge unless the bees are in a hard-to-reach area or part of an established hive. " }}
      />
      <Img
        src="https://img.mailinblue.com/8333748/images/content_library/original/6748d4567a538a028e1ef05f.png"
        alt=""
        width="185px"
        style={{ display: 'block', margin: '0 auto' }}
      />
      <Text
        style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
        dangerouslySetInnerHTML={{ __html: "Safety First" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Your safety, and that of those around you is your responsibility. Never attempt to capture colonies in unsafe locations." }}
      />
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
