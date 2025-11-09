# Apple Human Interface Guidelines Component Library

Kompletna biblioteka komponentów React implementująca Apple Human Interface Guidelines, zbudowana z Tailwind CSS 4 i CSS custom properties.

## 📋 Spis treści

- [Instalacja](#instalacja)
- [Komponenty](#komponenty)
- [Design Tokens](#design-tokens)
- [Przykłady użycia](#przykłady-użycia)
- [Zasady projektowe](#zasady-projektowe)

## 🚀 Instalacja

```tsx
// Import całej biblioteki
import * as AppleHIG from "@/components/apple-hig";

// Lub import selektywny
import { Button, Card, Sheet } from "@/components/apple-hig";
```

## 🎨 Komponenty

### 1. Button

Przyciski w trzech wariantach zgodnie z Apple HIG:

```tsx
<Button variant="filled" color="blue">Primary Action</Button>
<Button variant="default" color="gray">Secondary Action</Button>
<Button variant="plain" color="blue">Tertiary Action</Button>
```

**Props:**

- `variant`: 'filled' | 'default' | 'plain'
- `color`: 'blue' | 'gray' | 'red' | 'green' | 'orange'
- `size`: 'small' | 'medium' | 'large'
- `fullWidth`: boolean
- `isLoading`: boolean

**Cechy:**

- Minimum 44x44pt touch target
- Spring animations
- Wyraźne stany disabled i loading

### 2. Input & TextArea

Pola input z czystym, minimalistycznym designem:

```tsx
<Input
  label="Email"
  placeholder="Wpisz swój email"
  error="Nieprawidłowy format"
  icon={<MailIcon />}
/>

<TextArea
  label="Opis"
  helperText="Maksymalnie 500 znaków"
  rows={4}
/>
```

**Cechy:**

- Niebieski focus ring
- Inline validation
- Ikony i prawe elementy
- Accessibility ARIA

### 3. Typography

Kompletny system typografii Apple:

```tsx
<LargeTitle>Hero Title</LargeTitle>
<Title1>Main Heading</Title1>
<Title2>Section Heading</Title2>
<Body>Standard content text</Body>
<Caption1>Small label</Caption1>

// Lub użyj uniwersalnego komponentu Text
<Text size="headline" weight="semibold" color="blue">
  Custom text
</Text>
```

**Dostępne komponenty:**

- `LargeTitle` (34px) - Hero sections
- `Title1` (28px) - Main headings
- `Title2` (22px) - Section headings
- `Title3` (20px) - Subsection headings
- `Headline` (17px) - Emphasized content
- `Body` (17px) - Standard text
- `Callout` (16px) - Secondary content
- `Subheadline` (15px) - Tertiary content
- `Footnote` (13px) - Supporting info
- `Caption1` (12px) - Small labels
- `Caption2` (11px) - Smallest text

### 4. Card

Karty z elevacją i zaokrągleniami charakterystycznymi dla Apple:

```tsx
<Card elevation="md" padding="lg" hoverable>
  <CardHeader
    title="Card Title"
    subtitle="Subtitle text"
    action={<Button variant="plain">Action</Button>}
  />
  <CardContent spacing="md">
    <Body>Card content goes here</Body>
  </CardContent>
  <CardFooter>
    <Button variant="filled">Primary</Button>
  </CardFooter>
</Card>

// Grupowane karty (iOS Settings style)
<CardGroup spacing="md">
  <Card variant="inset">...</Card>
  <Card variant="inset">...</Card>
</CardGroup>
```

### 5. Sheet & AlertDialog

Modalne komponenty w stylu iOS:

```tsx
// Sheet - wysuwający się od dołu
<Sheet
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Select Option"
  size="large"
  blurBackground
  showHandle
>
  <Body>Sheet content</Body>
</Sheet>

// AlertDialog - dialogowe ostrzeżenie
<AlertDialog
  open={showAlert}
  onClose={() => setShowAlert(false)}
  title="Delete Item?"
  message="This action cannot be undone."
  primaryAction={{
    label: "Delete",
    destructive: true,
    onAction: handleDelete
  }}
  cancelAction={{ label: "Cancel" }}
/>
```

### 6. Form Components

Komponenty formularzy w stylu iOS Settings:

```tsx
<FormGroup title="Account Settings" footer="Your settings are private">
  <FormField
    label="Username"
    value="john.doe"
    icon={<UserIcon />}
    chevron
    clickable
  />
  <FormSeparator />
  <FormField
    label="Notifications"
    control={<Switch checked={enabled} onChange={setEnabled} />}
  />
</FormGroup>

// Segmented Control
<SegmentedControl
  options={[
    { value: '1', label: 'Day' },
    { value: '2', label: 'Week' },
    { value: '3', label: 'Month' }
  ]}
  value={selected}
  onChange={setSelected}
/>
```

### 7. Navigation

Komponenty nawigacyjne iOS i macOS:

```tsx
// Tab Bar (iOS bottom navigation)
<TabBar>
  <TabBarItem icon={<HomeIcon />} label="Home" active />
  <TabBarItem icon={<SearchIcon />} label="Search" />
  <TabBarItem icon={<ProfileIcon />} label="Profile" badge={3} />
</TabBar>

// Navigation Bar (top bar)
<NavigationBar
  title="Page Title"
  leftAction={<BackButton onClick={goBack} />}
  rightAction={<Button variant="plain">Done</Button>}
  blur
/>

// Sidebar (macOS/iPadOS)
<Sidebar header={<Title3>Navigation</Title3>}>
  <SidebarItem icon={<HomeIcon />} label="Home" active />
  <SidebarItem icon={<FolderIcon />} label="Projects" badge={5} />
</Sidebar>
```

### 8. List

Listy w stylu iOS Settings z inset style:

```tsx
<ListGroup title="Settings" footer="Manage your preferences">
  <ListItem
    title="Profile"
    subtitle="John Doe"
    icon={<UserIcon />}
    chevron
    clickable
  />
  <ListSeparator />
  <ListItem
    title="Notifications"
    value="Enabled"
    badge={3}
  />
</ListGroup>

// Swipeable List Item (iOS Mail style)
<SwipeableListItem
  title="Email Message"
  subtitle="From: sender@example.com"
  rightActions={[
    { label: 'Delete', color: 'red', onClick: handleDelete },
    { label: 'Archive', color: 'blue', onClick: handleArchive }
  ]}
/>
```

### 9. Feedback

Komponenty feedbacku i statusu:

```tsx
// Toast notification
<Toast
  open={showToast}
  message="Changes saved successfully"
  icon={<CheckIcon />}
  duration={3000}
  position="top"
/>

// Banner
<Banner
  open={showBanner}
  message="New version available"
  type="info"
  action={{ label: "Update", onClick: handleUpdate }}
  dismissible
/>

// Progress bar
<Progress
  value={75}
  max={100}
  showLabel
  label="Upload progress"
  color="blue"
/>

// Activity Indicator (spinner)
<ActivityIndicator size="md" label="Loading..." />

// Skeleton loader
<Skeleton variant="text" width="100%" />
<Skeleton variant="circle" width={48} height={48} />
<Skeleton variant="rect" width="100%" height={200} />

// Empty State
<EmptyState
  icon={<InboxIcon />}
  title="No messages"
  description="Your inbox is empty"
  action={{ label: "Compose", onClick: handleCompose }}
/>

// Badge
<Badge color="red" size="md">3</Badge>
```

### 10. Layout

Komponenty układu i struktury:

```tsx
// Container
<Container size="lg" padding centered>
  <Body>Content within max-width container</Body>
</Container>

// Stack (vertical/horizontal layout)
<Stack direction="vertical" spacing="md" align="start">
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</Stack>

// Grid
<Grid columns={3} gap="md" responsive>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>

// Section
<Section
  title="Features"
  subtitle="Explore our capabilities"
  action={<Button variant="plain">View all</Button>}
  spacing="lg"
>
  <Grid columns={3}>...</Grid>
</Section>

// Utilities
<Spacer size="lg" />
<Divider spacing="md" label="OR" />
<Center minHeight="100vh">
  <ActivityIndicator />
</Center>
<AspectRatio ratio="video">
  <img src="..." alt="..." />
</AspectRatio>
```

## 🎨 Design Tokens

Wszystkie komponenty używają CSS custom properties zdefiniowanych w `global.css`:

### Kolory

```css
--apple-blue: System Blue --apple-green: System Green --apple-red: System Red --apple-gray: System Gray (6 odcieni)
  --apple-label: Primary/Secondary/Tertiary/Quaternary;
```

### Spacing (8pt grid)

```css
--apple-space-1 through --apple-space-10
```

### Typography

```css
--apple-font-large-title through --apple-font-caption-2
--apple-weight-ultralight through --apple-weight-black
```

### Corner Radius

```css
--apple-radius-small: 6px --apple-radius-medium: 10px --apple-radius-large: 14px --apple-radius-xlarge: 20px;
```

### Shadows

```css
--apple-shadow-sm through --apple-shadow-xl
```

### Animations

```css
--apple-spring-duration: 350ms --apple-spring-easing: cubic-bezier(0.2, 0.9, 0.3, 1);
```

## 🌙 Dark Mode

Wszystkie komponenty automatycznie wspierają dark mode poprzez CSS custom properties:

```tsx
// Dark mode jest włączany przez dodanie klasy 'dark' do elementu <html>
<html className="dark">
```

## ♿ Accessibility

Wszystkie komponenty są zgodne z WCAG 2.1 Level AA:

- Focus indicators (2px outline)
- ARIA attributes
- Keyboard navigation
- Screen reader support
- Minimum touch targets (44x44pt)
- Color contrast ratios

## 📱 Responsive Design

Komponenty są w pełni responsywne i działają na:

- iOS (iPhone, iPad)
- macOS
- Android
- Web

## 🎯 Kluczowe zasady Apple HIG

1. **Clarity** (Przejrzystość) - Treść ma pierwszeństwo
2. **Deference** (Szacunek) - UI nie konkuruje z treścią
3. **Depth** (Głębia) - Warstwy i hierarchia
4. **Consistency** (Spójność) - Przewidywalne zachowania

## 📚 Przykłady użycia

### Prosty formularz

```tsx
import { FormGroup, FormField, Switch, Button, Stack } from "@/components/apple-hig";

function SettingsForm() {
  const [notifications, setNotifications] = useState(true);

  return (
    <Stack direction="vertical" spacing="lg">
      <FormGroup title="Preferences">
        <FormField
          label="Enable Notifications"
          control={<Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />}
        />
      </FormGroup>

      <Button variant="filled" fullWidth>
        Save Changes
      </Button>
    </Stack>
  );
}
```

### Karta z akcjami

```tsx
import { Card, CardHeader, CardContent, Button, Body, Stack } from "@/components/apple-hig";

function ProductCard() {
  return (
    <Card elevation="md" hoverable>
      <CardImage src="/product.jpg" aspectRatio="video" />
      <CardHeader title="Product Name" subtitle="$99.99" />
      <CardContent>
        <Body>Product description goes here...</Body>
      </CardContent>
      <CardFooter>
        <Stack direction="horizontal" spacing="sm" justify="end">
          <Button variant="default">Learn More</Button>
          <Button variant="filled">Buy Now</Button>
        </Stack>
      </CardFooter>
    </Card>
  );
}
```

## 🔧 Rozwój

Biblioteka jest zbudowana z:

- **React 19** - UI framework
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **CSS Custom Properties** - Theming

## 📄 Licencja

Ten projekt został stworzony dla 10xDevs jako część kursu frontend development.

---

**Autor:** 10xDevs Team  
**Wersja:** 1.0.0  
**Data:** 2024
