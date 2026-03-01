import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components"

type ClaimConfirmationProps = {
  contactName: string
  desiredResolution: string
}

export function ClaimConfirmation({
  contactName,
  desiredResolution,
}: ClaimConfirmationProps) {
  return (
    <Html lang="cs">
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Section>
            <Text style={heading}>Potvrzení reklamace</Text>
            <Text style={text}>
              Vážený/á {contactName}, děkujeme za nahlášení reklamace.
            </Text>
            <Text style={text}>
              Vaše reklamace bude vyřízena do 30 dnů dle zákona.
            </Text>
            <Text style={text}>
              Požadované řešení: <strong>{desiredResolution}</strong>
            </Text>
          </Section>
          <Hr style={hr} />
          <Section>
            <Text style={footer}>
              <strong>Dlouhy Technology s.r.o.</strong>
              <br />
              Kaštanová 489/34, 620 00 Brno
              <br />
              Tel:{" "}
              <Link href="tel:+420541423211" style={link}>
                +420 541 423 211
              </Link>
              <br />
              <Link href="https://dlouhy-technology.cz" style={link}>
                dlouhy-technology.cz
              </Link>
            </Text>
            <Text style={unsubscribe}>
              Tento e-mail byl odeslán automaticky jako potvrzení Vaší
              reklamace. Neodpovídejte na něj.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const body = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
}

const heading = {
  fontSize: "24px",
  fontWeight: "bold" as const,
  color: "#1a1a1a",
  marginBottom: "16px",
}

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333333",
}

const hr = {
  borderColor: "#e6e6e6",
  margin: "32px 0",
}

const footer = {
  fontSize: "13px",
  lineHeight: "22px",
  color: "#666666",
}

const link = {
  color: "#0066cc",
  textDecoration: "none" as const,
}

const unsubscribe = {
  fontSize: "12px",
  color: "#999999",
  marginTop: "16px",
}
