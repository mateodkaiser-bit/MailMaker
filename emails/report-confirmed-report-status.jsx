import { Html, Head, Body, Container, Img, Link, Section, Column, Text, Hr, Row } from '@react-email/components';

export const subject = "Thanks for reporting a bee colony!";

export default function ReportConfirmedReportStatus({
  associationlogo = "https://swarmwatch.example.org/assets/logo.png",
  associationlink = "https://swarmwatch.example.org/association",
  swarmimage = "https://swarmwatch.example.org/images/swarm-456.jpg",
  swarmcity = "Springfield",
  reportername = "Alice Johnson",
  swarmassociation = "Midwest Beekeepers Association",
} = {}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Link href={associationlink}>
        <Img
          src={associationlogo}
          alt="Association Logo"
          width="306px"
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
            dangerouslySetInnerHTML={{ __html: `Thank you for reporting a colony in ${swarmcity}` }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "You'll receive an email from us as soon as a local beekeeper responds to your report." }}
          />
          <Section style={{ padding: '18px 0 0 0', margin: 0 }} />
        </Column>
      </Section>
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: `Hi ${reportername}, this is Mateo, Master Beekeeper and Managing Director of Swarmed.` }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Thank you for reporting a bee colony and choosing to protect these vital pollinators. Your report helps us get one step closer to<strong> our goal of protecting 200 million bees and pollinating 10 billion flowers a year</strong>." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Swarmed is free to use, but if you’d like to support our work, we welcome a <a href=\"https://donate.stripe.com/eVa4jidd1dEEddSdQQ\"><strong><u>$12 suggested contribution here</u></strong></a>." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Thank you,<br/>Mateo" }}
      />
      <Text
        style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
        dangerouslySetInnerHTML={{ __html: `This colony was reported via ${swarmassociation}` }}
      />
      <Hr
        style={{ borderColor: '#091747', borderTopWidth: '2px', width: '100%', margin: '16px auto' }}
      />
      <Section>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Text
            style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
            dangerouslySetInnerHTML={{ __html: "What to expect:" }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "By reporting the colony through Swarmed, you’re ensuring these bees are safely relocated by a local beekeeper rather than exterminated. " }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "This helps protect honey bee populations, which are essential to our environment and food systems." }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "Thank you for being part of this work!" }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "<br/>-Mateo" }}
          />
        </Column>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Img
            src="https://img.mailinblue.com/8333748/images/content_library/original/6985bc390a39886a232b2b84.jpeg"
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
        dangerouslySetInnerHTML={{ __html: "A Beekeeper Will Contact You Soon" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Once a beekeeper claims your report, they’ll reach out to you directly to coordinate the safe removal of the bees. This might be through email, text, or phone." }}
      />
      <Img
        src="https://img.mailinblue.com/8333748/images/content_library/original/6748d465bd06436524dabc9d.png"
        alt=""
        width="185px"
        style={{ display: 'block', margin: '0 auto' }}
      />
      <Text
        style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
        dangerouslySetInnerHTML={{ __html: "Swarm Removals Are Often Free" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Beekeepers often rescue bee swarms at no cost. However, if the colony is in a difficult-to-reach spot or is an established hive, they may quote you a price for their time and skill." }}
      />
      <Img
        src="https://img.mailinblue.com/8333748/images/content_library/original/6748d4567a538a028e1ef05f.png"
        alt=""
        width="185px"
        style={{ display: 'block', margin: '0 auto' }}
      />
      <Text
        style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
        dangerouslySetInnerHTML={{ __html: "Your Safety Is a Priority" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "While waiting for the beekeeper to arrive, avoid disturbing the bees and keep a safe distance." }}
      />
      <Section>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Link href="https://beeswarmed.org/">
            <Img
              src="https://img.mailinblue.com/8333748/images/content_library/original/6985b7f70a39886a232b2931.png"
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
