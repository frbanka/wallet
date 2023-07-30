import React, { useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Grid, useMediaQuery } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Header } from '../../components/header/header';
import { Navigation } from '../../components/navigation/navigation';
import { Balance } from '../../components/balance/balance';
import Currency from '../../components/currency/currency';
import {
  fetchTransactions,
  fetchBalance,
  fetchMonthlyStats,
} from '../../redux/finance/operations';
import {
  Vector,
  ContainerWrapper,
  StyledContainer,
  DashboardWrapper,
} from './dashboard.styles';
import { getCurrentYearAndMonth } from '../../utils/getCurrentYearAndMonth.js';

import { getCurrentYearAndMonth } from '../../utils/getCurrentYearAndMonth.js';

export default function DashboardPage() {
  const dispatch = useDispatch();

  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const isTablet = useMediaQuery((theme) =>
    theme.breakpoints.between('md', 'lg')
  );
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBalance());
    const { year, month } = getCurrentYearAndMonth();
    dispatch(fetchMonthlyStats({ year, month }));
  }, [dispatch]);

  const renderDeskTabLayout = () => {
    return (
      <Grid
        container
        sx={{ height: '100%' }}
        direction={isTablet ? 'column' : 'row'}
      >
        <Grid item variant={isDesktop ? 'desktop' : 'tablet'}>
          <Navigation />
          <Balance />
          <Currency />
        </Grid>
        {isDesktop && <Vector />}
        <Suspense>
          <Grid item>
            <Outlet />
          </Grid>
        </Suspense>
      </Grid>
    );
  };

  const renderMobileLayout = () => {
    return (
      <Grid container direction="column">
        <Grid item>
          <Navigation />
        </Grid>
        <Suspense>
          <Grid item>
            <Outlet />
          </Grid>
        </Suspense>
      </Grid>
    );
  };

  return (
    <DashboardWrapper>
      <Header />
      <ContainerWrapper>
        <StyledContainer fixed>
          {isMobile ? renderMobileLayout() : renderDeskTabLayout()}
        </StyledContainer>
      </ContainerWrapper>
    </DashboardWrapper>
  );
}
