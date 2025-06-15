import { useEffect, useState } from 'react';
import { getAllInvoices, cancelSubscription } from '../../api/checkout/invoices';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MainLayout from '../../layouts/MainLayout';
import { Download, AlertCircle, CheckCircle2, Clock, XCircle, Receipt, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Financial() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const userData = JSON.parse(localStorage.getItem('user'));
    const subscriptionStatus = userData?.stripeSubscriptionStatus || 'inactive';
    const { logout } = useAuth();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const data = await getAllInvoices();
                setInvoices(data);
            } catch (error) {
                console.error('Erro ao buscar faturas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const handleCancelSubscription = async () => {
        try {
            setIsCancelling(true);
            await cancelSubscription(userData.specificId);
            // Faz logout do usuário
            logout();
            // Redireciona para a página de login
            window.location.href = '/login';
        } catch (error) {
            console.error('Erro ao cancelar assinatura:', error);
            alert('Erro ao cancelar assinatura. Por favor, tente novamente.');
        } finally {
            setIsCancelling(false);
            setShowConfirmModal(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
            case 'active':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'pending':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'failed':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid':
            case 'active':
                return <CheckCircle2 className="w-5 h-5" />;
            case 'pending':
                return <Clock className="w-5 h-5" />;
            case 'failed':
                return <XCircle className="w-5 h-5" />;
            default:
                return <AlertCircle className="w-5 h-5" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'paid':
                return 'Pago';
            case 'pending':
                return 'Pendente';
            case 'failed':
                return 'Falhou';
            case 'active':
                return 'Ativo';
            case 'inactive':
                return 'Inativo';
            default:
                return status;
        }
    };

    const totalAmount = invoices.reduce((acc, curr) => acc + curr.amount, 0) / 100;

    return (
        <MainLayout>
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Financeiro</h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">Gerencie suas faturas e assinatura</p>
                    </div>
                    {subscriptionStatus === 'active' && (
                        <button
                            onClick={() => setShowConfirmModal(true)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            Cancelar Assinatura
                        </button>
                    )}
                </div>
                
                {/* Modal de Confirmação */}
                {showConfirmModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-4">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Cancelar Assinatura</h3>
                            </div>
                            <p className="text-sm sm:text-base text-gray-600 mb-6">
                                Tem certeza que deseja cancelar sua assinatura? Esta ação não pode ser desfeita.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    disabled={isCancelling}
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={handleCancelSubscription}
                                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                    disabled={isCancelling}
                                >
                                    {isCancelling ? 'Cancelando...' : 'Confirmar Cancelamento'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                                <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-gray-600">Status da Assinatura</h2>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mt-1 ${getStatusColor(subscriptionStatus)}`}>
                                    {getStatusIcon(subscriptionStatus)}
                                    <span className="text-sm sm:text-base font-medium">{getStatusText(subscriptionStatus)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
                                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-gray-600">Total de Faturas</h2>
                                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{invoices.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Histórico de Faturas</h2>
                        <div className="text-xs sm:text-sm text-gray-500">
                            Última atualização: {format(new Date(), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center py-8 sm:py-12">
                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : (
                        <>
                            {/* Visualização em Cards (Mobile) */}
                            <div className="sm:hidden space-y-4">
                                {invoices.map((invoice) => (
                                    <div key={invoice.id} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs text-gray-500">Número</p>
                                                <p className="text-sm font-medium text-gray-900">{invoice.number}</p>
                                            </div>
                                            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
                                                {getStatusIcon(invoice.status)}
                                                <span className="text-xs font-medium">{getStatusText(invoice.status)}</span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <p className="text-xs text-gray-500">Data</p>
                                            <p className="text-sm text-gray-900">
                                                {format(new Date(invoice.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">Valor</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: invoice.currency.toUpperCase()
                                                }).format(invoice.amount / 100)}
                                            </p>
                                        </div>

                                        <div className="pt-2">
                                            <a
                                                href={invoice.pdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                Baixar PDF
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Visualização em Tabela (Desktop) */}
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {invoices.map((invoice) => (
                                            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {format(new Date(invoice.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {new Intl.NumberFormat('pt-BR', {
                                                            style: 'currency',
                                                            currency: invoice.currency.toUpperCase()
                                                        }).format(invoice.amount / 100)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
                                                        {getStatusIcon(invoice.status)}
                                                        <span className="text-sm font-medium">{getStatusText(invoice.status)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a
                                                        href={invoice.pdf}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Baixar PDF
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
} 