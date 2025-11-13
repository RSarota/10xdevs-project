/**
 * Apple Human Interface Guidelines Component Library
 *
 * A comprehensive collection of React components implementing Apple's HIG design system.
 * Built with Tailwind CSS 4 and CSS custom properties for theming.
 *
 * @author 10xDevs
 * @version 1.0.0
 */

// Button
export { Button } from "./Button";
export type { ButtonProps } from "./Button";

// Input & TextArea
export { Input, TextArea } from "./Input";
export type { InputProps, TextAreaProps } from "./Input";

// Typography
export {
  LargeTitle,
  Title1,
  Title2,
  Title3,
  Headline,
  Body,
  Callout,
  Subheadline,
  Footnote,
  Caption1,
  Caption2,
  Text,
} from "./Typography";
export type { TextProps } from "./Typography";

// Card
export { Card, CardHeader, CardContent, CardFooter } from "./Card";
export type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps } from "./Card";

// Sheet & Dialogs
export { Sheet, AlertDialog } from "./Sheet";
export type { SheetProps, AlertDialogProps } from "./Sheet";

// Form Components
export { FormGroup, FormField, FormSeparator, Switch, SegmentedControl } from "./Form";
export type { FormGroupProps, FormFieldProps, SwitchProps, SegmentedControlProps } from "./Form";

// Navigation
export { TabBar, TabBarItem, NavigationBar, BackButton, Sidebar, SidebarItem } from "./Navigation";
export type {
  TabBarProps,
  TabBarItemProps,
  NavigationBarProps,
  BackButtonProps,
  SidebarProps,
  SidebarItemProps,
} from "./Navigation";

// List
export { List, ListItem, ListGroup, ListSeparator } from "./List";
export type { ListProps, ListItemProps, ListGroupProps, ListSeparatorProps } from "./List";

// Feedback
export { Banner, Progress, ActivityIndicator, Skeleton, EmptyState, Badge } from "./Feedback";
export type {
  BannerProps,
  ProgressProps,
  ActivityIndicatorProps,
  SkeletonProps,
  EmptyStateProps,
  BadgeProps,
} from "./Feedback";

// Layout
export { Container, Stack, Grid, Spacer, Divider, Section } from "./Layout";
export type { ContainerProps, StackProps, GridProps, SpacerProps, DividerProps, SectionProps } from "./Layout";
