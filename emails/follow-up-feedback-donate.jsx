import { Html, Head, Body, Container, Img, Text, Section, Column, Button, Hr, Link, Row } from '@react-email/components';

export const subject = "Checking in on your bee colony report.";

export default function FollowUpFeedbackDonate({
  reportername = "Alice Johnson",
  numberofbees = "~5,000",
} = {}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Img
        src="https://img.mailinblue.com/8333748/images/content_library/original/674dcfb85949f7d2d930bb2b.jpeg"
        alt=""
        width="100%"
        style={{ display: 'block', margin: '0 auto' }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: `Hi ${reportername},` }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "I’m Mateo, a Master Beekeeper, and I run Swarmed. Hopefully, by now, the beekeeper who claimed your report has been in touch, and things are moving along smoothly, whether they’re working on the rescue or the bees are already safe in their new home." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: `By reporting this colony, you’ve likely helped save an estimated <strong>${numberofbees} honey bees.</strong> Every year, millions of bee swarms emerge, but only <strong>1 in 4 colonies survive without help</strong>. ` }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "<br/>" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Swarmed exists to change that by connecting the public with beekeepers who can safely rescue and rehome bees." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "Thank you for being part of this work. With your help, we’re saving honey bees, supporting beekeepers and bee researchers, and protecting the ecosystems we all depend on." }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "If you’d like to do more for bees, here are some quick things you can do:" }}
      />
      <Section>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Button
            href="https://donate.stripe.com/eVa4jidd1dEEddSdQQ"
            style={{
              backgroundColor: '#faca0c',
              color: '#ffffff',
              borderRadius: '4px',
              padding: '12px 24px 12px 24px',
              fontSize: '16px',
              fontWeight: 600,
              textAlign: 'center',
              display: 'block',
            }}
          >
            Make a Contribution
          </Button>
        </Column>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Text
            style={{ fontSize: '24px', fontWeight: 700, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
            dangerouslySetInnerHTML={{ __html: "Leave Us a Review" }}
          />
          <Hr
            style={{ borderColor: '#E5E7EB', borderTopWidth: '0px', width: '100%', margin: '16px auto' }}
          />
        </Column>
      </Section>
      <Section>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Img
            src="https://img.mailinblue.com/8333748/images/content_library/original/674dd0b3bfc3dc71a1ffa1bc.jpeg"
            alt=""
            width="194px"
            style={{ display: 'block', margin: '0 auto' }}
          />
        </Column>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Text
            style={{ fontSize: '20px', fontWeight: 600, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
            dangerouslySetInnerHTML={{ __html: "Thank you for making a difference for honey bees" }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "Using Swarmed helps ensure a better future for our pollinators and the beekeeping community." }}
          />
          <Text
            style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
            dangerouslySetInnerHTML={{ __html: "Best,<br/>Mateo, Master Beekeeper &amp; Managing Director of Swarmed" }}
          />
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
