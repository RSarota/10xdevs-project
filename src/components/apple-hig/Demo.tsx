import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Input,
  LargeTitle,
  Title2,
  Body,
  Stack,
  Grid,
  FormGroup,
  FormField,
  Switch,
  SegmentedControl,
  ListGroup,
  ListItem,
  Sheet,
  AlertDialog,
  Toast,
  Progress,
  ActivityIndicator,
  Badge,
  Container,
  Section,
  Divider,
} from "./index";

/**
 * Demo page showcasing all Apple HIG components
 *
 * This component demonstrates the usage of all components
 * from the Apple HIG library.
 */
export function AppleHIGDemo() {
  const [showSheet, setShowSheet] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [switchValue, setSwitchValue] = useState(true);
  const [segmentValue, setSegmentValue] = useState("1");

  return (
    <div className="min-h-screen bg-[hsl(var(--apple-grouped-bg))]">
      <Container size="lg" padding>
        <Stack direction="vertical" spacing="xl">
          {/* Header */}
          <Section
            title="Apple HIG Components"
            subtitle="A comprehensive library of components following Apple Human Interface Guidelines"
            spacing="lg"
          />

          <Divider spacing="lg" />

          {/* Buttons Section */}
          <Section title="Buttons" spacing="md">
            <Stack direction="vertical" spacing="md">
              <div>
                <Body className="mb-3">Filled Buttons</Body>
                <Stack direction="horizontal" spacing="sm" wrap>
                  <Button variant="filled" color="blue">
                    Blue Button
                  </Button>
                  <Button variant="filled" color="gray">
                    Gray Button
                  </Button>
                  <Button variant="filled" color="green">
                    Green Button
                  </Button>
                  <Button variant="filled" color="red">
                    Red Button
                  </Button>
                  <Button variant="filled" color="blue" isLoading>
                    Loading
                  </Button>
                </Stack>
              </div>

              <div>
                <Body className="mb-3">Default Buttons</Body>
                <Stack direction="horizontal" spacing="sm" wrap>
                  <Button variant="default" color="blue">
                    Blue Button
                  </Button>
                  <Button variant="default" color="gray">
                    Gray Button
                  </Button>
                  <Button variant="default" disabled>
                    Disabled
                  </Button>
                </Stack>
              </div>

              <div>
                <Body className="mb-3">Plain Buttons</Body>
                <Stack direction="horizontal" spacing="sm" wrap>
                  <Button variant="plain" color="blue">
                    Blue Link
                  </Button>
                  <Button variant="plain" color="red">
                    Red Link
                  </Button>
                </Stack>
              </div>
            </Stack>
          </Section>

          <Divider spacing="lg" />

          {/* Forms Section */}
          <Section title="Forms" spacing="md">
            <Stack direction="vertical" spacing="md">
              <Input label="Email" placeholder="your@email.com" helperText="We'll never share your email" />

              <Input label="Password" type="password" placeholder="Enter your password" error="Password is required" />

              <Input label="Verified Email" placeholder="verified@email.com" success />
            </Stack>
          </Section>

          <Divider spacing="lg" />

          {/* Cards Section */}
          <Section title="Cards" spacing="md">
            <Grid columns={3} gap="md" responsive>
              <Card elevation="sm" hoverable>
                <CardHeader title="Card Title" subtitle="Subtitle" />
                <CardContent>
                  <Body>This is a card with shadow and hover effect.</Body>
                </CardContent>
                <CardFooter>
                  <Button variant="filled" size="small" fullWidth>
                    Action
                  </Button>
                </CardFooter>
              </Card>

              <Card elevation="md">
                <CardHeader title="With Badge" />
                <CardContent>
                  <Stack direction="horizontal" spacing="sm" align="center">
                    <Body>Notifications</Body>
                    <Badge color="red">3</Badge>
                  </Stack>
                </CardContent>
              </Card>

              <Card elevation="lg">
                <CardHeader title="Progress" />
                <CardContent spacing="md">
                  <Progress value={75} showLabel label="Upload" />
                  <Progress value={50} color="green" />
                  <Progress value={25} color="orange" />
                </CardContent>
              </Card>
            </Grid>
          </Section>

          <Divider spacing="lg" />

          {/* Form Components Section */}
          <Section title="Form Components" spacing="md">
            <FormGroup title="Settings" footer="These settings control your account preferences">
              <FormField
                label="Enable Notifications"
                description="Receive push notifications"
                control={<Switch checked={switchValue} onChange={(e) => setSwitchValue(e.target.checked)} />}
              />
            </FormGroup>

            <div className="mt-6">
              <Body className="mb-3">View Mode</Body>
              <SegmentedControl
                options={[
                  { value: "1", label: "Day" },
                  { value: "2", label: "Week" },
                  { value: "3", label: "Month" },
                ]}
                value={segmentValue}
                onChange={setSegmentValue}
                fullWidth
              />
            </div>
          </Section>

          <Divider spacing="lg" />

          {/* Lists Section */}
          <Section title="Lists" spacing="md">
            <ListGroup title="Account" footer="Manage your account settings">
              <ListItem
                title="Profile"
                subtitle="John Doe"
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
                chevron
                clickable
              />
              <ListItem title="Notifications" value="Enabled" badge={3} clickable />
            </ListGroup>
          </Section>

          <Divider spacing="lg" />

          {/* Modals Section */}
          <Section title="Modals & Dialogs" spacing="md">
            <Stack direction="horizontal" spacing="sm" wrap>
              <Button variant="filled" onClick={() => setShowSheet(true)}>
                Open Sheet
              </Button>
              <Button variant="filled" color="red" onClick={() => setShowAlert(true)}>
                Show Alert
              </Button>
              <Button variant="filled" color="green" onClick={() => setShowToast(true)}>
                Show Toast
              </Button>
            </Stack>
          </Section>

          <Divider spacing="lg" />

          {/* Feedback Section */}
          <Section title="Feedback Components" spacing="md">
            <Stack direction="vertical" spacing="md">
              <div>
                <Body className="mb-3">Activity Indicators</Body>
                <Stack direction="horizontal" spacing="lg" align="center">
                  <ActivityIndicator size="sm" />
                  <ActivityIndicator size="md" />
                  <ActivityIndicator size="lg" />
                  <ActivityIndicator size="md" label="Loading..." />
                </Stack>
              </div>

              <div>
                <Body className="mb-3">Badges</Body>
                <Stack direction="horizontal" spacing="sm" align="center">
                  <Badge color="red">3</Badge>
                  <Badge color="blue">New</Badge>
                  <Badge color="green" size="lg">
                    ✓
                  </Badge>
                  <Badge color="orange" variant="outlined">
                    !
                  </Badge>
                </Stack>
              </div>
            </Stack>
          </Section>

          <Divider spacing="lg" />

          {/* Typography Section */}
          <Section title="Typography" spacing="md">
            <Stack direction="vertical" spacing="sm">
              <LargeTitle>Large Title - 34px</LargeTitle>
              <Title2>Title 2 - 22px</Title2>
              <Body>Body text - 17px. This is the standard text size for most content in your application.</Body>
            </Stack>
          </Section>
        </Stack>
      </Container>

      {/* Sheet Modal */}
      <Sheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        title="Select an Option"
        subtitle="Choose one of the options below"
        size="default"
        showHandle
        blurBackground
      >
        <Stack direction="vertical" spacing="md">
          <Body>This is a sheet that slides up from the bottom, just like in iOS.</Body>
          <ListGroup>
            <ListItem title="Option 1" clickable onClick={() => setShowSheet(false)} />
            <ListItem title="Option 2" clickable onClick={() => setShowSheet(false)} />
            <ListItem title="Option 3" clickable onClick={() => setShowSheet(false)} />
          </ListGroup>
          <Button variant="filled" fullWidth onClick={() => setShowSheet(false)}>
            Done
          </Button>
        </Stack>
      </Sheet>

      {/* Alert Dialog */}
      <AlertDialog
        open={showAlert}
        onClose={() => setShowAlert(false)}
        title="Delete Item?"
        message="This action cannot be undone. Are you sure you want to proceed?"
        primaryAction={{
          label: "Delete",
          destructive: true,
          onAction: () => {
            // Demo action - would delete item here
          },
        }}
        secondaryAction={{
          label: "Keep",
          onAction: () => {
            // Demo action - would keep item here
          },
        }}
        cancelAction={{
          label: "Cancel",
        }}
      />

      {/* Toast Notification */}
      <Toast
        open={showToast}
        message="Action completed successfully"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        }
        duration={3000}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default AppleHIGDemo;
