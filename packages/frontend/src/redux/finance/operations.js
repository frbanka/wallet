import { createAsyncThunk } from '@reduxjs/toolkit';
import { startAsyncRequest, finishAsyncRequest } from '../global/slice';
import { closeModal } from '../../redux/global/operations';
import { notifyError } from '../../utils/notifies';
import { getCurrentYearAndMonth } from '../../utils/getCurrentYearAndMonth.js';
import { axiosAPI, setAuthHeader } from '../../utils/axios';

export const fetchTransactions = createAsyncThunk(
  'finance/fetchTransactions',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;
    if (persistedToken === null) {
      return thunkAPI.rejectWithValue('Token is missing');
    }

    thunkAPI.dispatch(startAsyncRequest());

    try {
      setAuthHeader(persistedToken);
      const res = await axiosAPI.get('/finance/transactions');
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(finishAsyncRequest());
    }
  }
);

export const fetchMonthlyStats = createAsyncThunk(
  'finance/fetchMonthlyStats',
  async ({ year, month }, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;
    if (persistedToken === null) {
      return thunkAPI.rejectWithValue('Token is missing');
    }

    thunkAPI.dispatch(startAsyncRequest());

    try {
      setAuthHeader(persistedToken);
      const res = await axiosAPI.get(`/finance/transactions/${year}/${month}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(finishAsyncRequest());
    }
  }
);

export const fetchBalance = createAsyncThunk(
  'finance/fetchBalance',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;
    if (persistedToken === null) {
      return thunkAPI.rejectWithValue('Token is missing');
    }

    thunkAPI.dispatch(startAsyncRequest());

    try {
      setAuthHeader(persistedToken);
      const res = await axiosAPI.get('/finance/balance');
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(finishAsyncRequest());
    }
  }
);

export const addTransaction = createAsyncThunk(
  'finance/addTransaction',
  async (transactionData, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;
    if (persistedToken === null) {
      return thunkAPI.rejectWithValue('Token is missing');
    }

    thunkAPI.dispatch(startAsyncRequest());

    try {
      setAuthHeader(persistedToken);
      const res = await axiosAPI.post('/finance/transactions', transactionData);
      thunkAPI.dispatch(fetchBalance());
      const { year, month } = getCurrentYearAndMonth();
      thunkAPI.dispatch(fetchMonthlyStats({ year, month }));
      thunkAPI.dispatch(closeModal('isModalAddTransactionOpen'));
      return res.data;
    } catch (error) {
      notifyError(error.message);
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(finishAsyncRequest());
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'finance/deleteTransaction',
  async (transactionId, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;
    if (persistedToken === null) {
      return thunkAPI.rejectWithValue('Token is missing');
    }

    thunkAPI.dispatch(startAsyncRequest());

    try {
      setAuthHeader(persistedToken);
      await axiosAPI.delete(`/finance/transactions/${transactionId}`);
      thunkAPI.dispatch(fetchBalance());
      const { year, month } = getCurrentYearAndMonth();
      thunkAPI.dispatch(fetchMonthlyStats({ year, month }));
      return transactionId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(finishAsyncRequest());
    }
  }
);

export const editTransaction = createAsyncThunk(
  'finance/editTransaction',
  async (transactionData, thunkAPI) => {
    thunkAPI.dispatch(startAsyncRequest());
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;
    if (persistedToken === null) {
      return thunkAPI.rejectWithValue('Token is missing');
    }

    try {
      setAuthHeader(persistedToken);
      const res = await axiosAPI.put(
        `/finance/transactions/${transactionData._id}`,
        transactionData
      );
      thunkAPI.dispatch(fetchBalance());
      thunkAPI.dispatch(fetchTransactions());
      const { year, month } = getCurrentYearAndMonth();
      thunkAPI.dispatch(fetchMonthlyStats({ year, month }));
      thunkAPI.dispatch(closeModal('isModalEditTransactionOpen'));
      return res.data;
    } catch (error) {
      notifyError(error.message);
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(finishAsyncRequest());
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'finance/fetchCategories',
  async (_, thunkAPI) => {
    thunkAPI.dispatch(startAsyncRequest());

    try {
      const res = await axiosAPI.get('/finance/categories');
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(finishAsyncRequest());
    }
  }
);
