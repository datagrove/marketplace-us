import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Home } from './Home';
import { useStore } from '@nanostores/solid';
import { useTranslations } from '../../i18n/utils';

vi.mock('@nanostores/solid', () => ({
  useStore: vi.fn(),
}));

vi.mock('@components/common/WindowSizeStore', () => ({
  windowSize: { get: vi.fn() },
}));

vi.mock('../../i18n/utils', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('@components/home/HomeCard', () => ({
  HomeCard: () => <div data-testid="home-card">Home Card</div>,
}));

vi.mock('./HomeGradeCarousel', () => ({
  HomeGradeCarousel: () => <div data-testid="home-grade-carousel">Home Grade Carousel</div>,
}));

describe('Home Component', () => {
  const mockTranslations = {
    "pageTitles.popularResources": "Popular Resources",
    "pageTitles.shopBySubject": "Shop by Subject",
    "pageTitles.newResources": "New Resources",
    "pageTitles.shopByGrade": "Shop by Grade",
  };

  beforeEach(() => {
    useTranslations.mockImplementation(() => (key) => mockTranslations[key] || key);
    useStore.mockReturnValue(() => 'sm');
  });

  it('renders the correct titles', () => {
    render(() => (
      <Home
        lang="en"
        stickyFilters={<div data-testid="sticky-filters" />}
        subjectCarousel={<div data-testid="subject-carousel" />}
      />
    ));
    expect(screen.getByText(mockTranslations["pageTitles.popularResources"])).toBeInTheDocument();
    expect(screen.getByText(mockTranslations["pageTitles.shopBySubject"])).toBeInTheDocument();
    expect(screen.getByText(mockTranslations["pageTitles.newResources"])).toBeInTheDocument();
    expect(screen.getByText(mockTranslations["pageTitles.shopByGrade"])).toBeInTheDocument();
  });
});

