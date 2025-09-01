import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-4">💰 Dashboard FinApp Haiti</h1>
      <p className="text-gray-600">Bienvenue dans votre application de gestion financière !</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-900">Comptes Bancaires</h3>
          <p className="text-blue-700">Gérez vos comptes</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="font-semibold text-green-900">Transactions</h3>
          <p className="text-green-700">Suivez vos dépenses</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="font-semibold text-purple-900">Sols</h3>
          <p className="text-purple-700">Vos tontines haïtiennes</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;