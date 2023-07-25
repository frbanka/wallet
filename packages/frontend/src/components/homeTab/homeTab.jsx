import React, { useState } from 'react';
import Media from 'react-media';

import Table from '../table/table';
import { TableCard } from '../tableCard/tableCard';
import { Balance } from '../balance/balance';
import { ButtonAddTransactions } from '../../components/buttonAddTransactions/buttonAddTransactions';
import { ModalAddTransaction } from '../../components/modalAddTransaction/modalAddTransaction';
import { ModalEditTransaction } from '../modalEditTransaction/modalEditTransaction';
import { closeModal, openModal } from '../../redux/global/operations';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsModalAddTransactionOpen,
  selectIsModalEditTransactionOpen,
} from '../../redux/global/selectors';
import { selectTransactions } from '../../redux/finance/selectors.js';
import {TableWrapper} from './homeTab.styles'

export default function HomeTab() {
  const dispatch = useDispatch();

  const isModalAddTransactionOpen = useSelector(
    selectIsModalAddTransactionOpen
  );

  const isModalEditTransactionOpen = useSelector(
    selectIsModalEditTransactionOpen
  );

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    dispatch(openModal('isModalEditTransactionOpen'));
  };

const transactions = useSelector(selectTransactions);

const sortedTransactions = [...transactions].sort(
(a, b) => new Date(b.date) - new Date(a.date)
);

  const renderDesktopLayout = () => {
    return (
      <TableWrapper>
        <Table data={sortedTransactions} />
      </TableWrapper>
    );
  };

  const renderMobileLayout = () => {
    return (
      <div>
        <Balance />
        <TableCard handleEditTransaction={handleEditTransaction} />
      </div>
    );
  };

  return (
    <div>
      <Media query="(min-width: 768px)">
        {(matches) => (matches ? renderDesktopLayout() : renderMobileLayout())}
      </Media>
      <ButtonAddTransactions
        handleClick={() => {
          dispatch(openModal('isModalAddTransactionOpen'));
        }}
      />
      {isModalAddTransactionOpen && (
        <ModalAddTransaction
          closeModal={() => dispatch(closeModal('isModalAddTransactionOpen'))}
        />
      )}

      {isModalEditTransactionOpen && (
        <ModalEditTransaction
          closeModal={() => dispatch(closeModal('isModalEditTransactionOpen'))}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
}
