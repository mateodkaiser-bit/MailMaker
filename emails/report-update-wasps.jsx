import { Html, Head, Body, Container, Img, Link, Section, Column, Text, Hr, Row } from '@react-email/components';

export const subject = "Update: Wasps, Not Bees - What You Need to Know";

export default function ReportUpdateWasps({
  swarmimage = "https://swarmwatch.example.org/images/swarm-456.jpg",
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
            dangerouslySetInnerHTML={{ __html: "Your report has been identified as wasps, not bees." }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "A beekeeper has reviewed your report and identified that you're dealing with wasps, not bees." }}
          />
          <Section style={{ padding: '18px 0 0 0', margin: 0 }} />
        </Column>
      </Section>
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Wasps (yellowjackets, hornets, etc.) can be more aggressive and pose different risks compared to honey bees. While bees are critical pollinators we aim to protect, wasps are generally only handled by pest control professionals, not beekeepers." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "We encourage you to contact our trusted <a href=\"https://www.networx.com/pest-control?utm_source=11483&utm_medium=affiliate\">local pest control partners</a> who can safely assess and assist you with the wasp removal." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Thank you for using Swarmed," }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "<br/>Mateo" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Master Beekeeper and Managing Director of Swarmed" }}
      />
      <Hr
        style={{ borderColor: '#091747', borderTopWidth: '2px', width: '100%', margin: '16px auto' }}
      />
      <Img
        src="https://img.mailinblue.com/8333748/images/content_library/original/68a7401403cd15fb1f0ed4db.png"
        alt=""
        width="185px"
        style={{ display: 'block', margin: '0 auto' }}
      />
      <Text
        style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
        dangerouslySetInnerHTML={{ __html: "Spotting wasp nests" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Wasps are most active during late summer and early fall when their colonies reach peak population. During this time, they become more aggressive in protecting their territory and searching for food." }}
      />
      <Img
        src="https://img.mailinblue.com/8333748/images/content_library/original/68a740363da913a8d57a27d8.png"
        alt=""
        width="185px"
        style={{ display: 'block', margin: '0 auto' }}
      />
      <Text
        style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
        dangerouslySetInnerHTML={{ __html: "Dealing with wasps" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Unlike honey bees that are critical pollinators, wasps can pose risks to human safety. When wasps build nests near homes or high-traffic areas, professional removal may be necessary." }}
      />
      <Img
        src="https://img.mailinblue.com/8333748/images/content_library/original/68a740264d5cc1376c8a4212.png"
        alt=""
        width="185px"
        style={{ display: 'block', margin: '0 auto' }}
      />
      <Text
        style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
        dangerouslySetInnerHTML={{ __html: "Wasp safety" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Wasps are more aggressive than honey bees and can sting multiple times without dying. Their stings are not just painful, but can be dangerous for people with allergies." }}
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
