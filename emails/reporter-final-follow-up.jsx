import { Html, Head, Body, Container, Img, Link, Button, Hr, Text, Section, Column, Row } from '@react-email/components';

export const subject = "One last note about bees";

export default function ReporterFinalFollowUp() {
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
      <Button
        href="https://donate.stripe.com/eVa4jidd1dEEddSdQQ?locale=en&__embed_source=buy_btn_1Ow3LuH1Kpm0W8nWiq2Ukvjz"
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
        Support Swarmed
      </Button>
      <Hr
        style={{ borderColor: '#4A4A4A', borderTopWidth: '3px', width: '100%', margin: '16px auto' }}
      />
      <Text
        style={{ fontSize: '24px', fontWeight: 700, lineHeight: '1.3', margin: '0 0 12px 0', color: '#333333' }}
        dangerouslySetInnerHTML={{ __html: "<strong>Did You Know?</strong>" }}
      />
      <Text
        style={{ textAlign: 'left', color: '#676a6c', fontSize: '16px', lineHeight: '1.6', margin: '0 0 8px 0' }}
        dangerouslySetInnerHTML={{ __html: "It takes around <strong>12 honey bees</strong> their entire lifetimes to produce just <strong>one teaspoon of honey</strong>, visiting <strong>tens of thousands of flowers</strong> in the process. By rescuing swarms, we help preserve these incredible pollinators and the vital work they do for our ecosystems." }}
      />
      <Section>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Img
            src="https://img.mailinblue.com/8333748/images/content_library/original/674de8775949f7d2d930c596.jpeg"
            alt=""
            width="286px"
            style={{ display: 'block', margin: '0 auto' }}
          />
        </Column>
        <Column style={{ width: '50%', verticalAlign: 'top' }}>
          <Img
            src="https://img.mailinblue.com/8333748/images/content_library/original/6748d4157a538a028e1ef04d.png"
            alt=""
            width="286px"
            style={{ display: 'block', margin: '0 auto' }}
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
