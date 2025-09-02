import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function PrivacyPolicy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              Política de Privacidade - Capital Daark
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">1. Informações Gerais</h2>
              <p className="text-muted-foreground">
                Esta Política de Privacidade descreve como a Capital Daark coleta, usa, armazena e protege 
                suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) 
                e demais legislações aplicáveis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">2. Informações que Coletamos</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-primary">2.1 Dados fornecidos por você:</h3>
                  <ul className="list-disc pl-6 text-muted-foreground">
                    <li>Nome completo</li>
                    <li>E-mail</li>
                    <li>Telefone</li>
                    <li>Data de nascimento</li>
                    <li>Endereço</li>
                    <li>Informações de pagamento (processadas com segurança)</li>
                    <li>Foto de perfil</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-primary">2.2 Dados coletados automaticamente:</h3>
                  <ul className="list-disc pl-6 text-muted-foreground">
                    <li>Endereço IP</li>
                    <li>Informações do navegador</li>
                    <li>Dados de uso da plataforma</li>
                    <li>Cookies e tecnologias similares</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">3. Como Usamos suas Informações</h2>
              <p className="text-muted-foreground mb-2">Utilizamos suas informações para:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar transações e pagamentos</li>
                <li>Comunicar sobre atualizações e ofertas</li>
                <li>Personalizar sua experiência</li>
                <li>Garantir a segurança da plataforma</li>
                <li>Cumprir obrigações legais</li>
                <li>Análise e melhoria dos serviços</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">4. Base Legal para Processamento</h2>
              <p className="text-muted-foreground">Processamos seus dados com base em:</p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li><strong>Consentimento:</strong> Quando você nos autoriza expressamente</li>
                <li><strong>Execução contratual:</strong> Para fornecer os serviços solicitados</li>
                <li><strong>Interesse legítimo:</strong> Para melhorar nossos serviços e segurança</li>
                <li><strong>Obrigação legal:</strong> Para cumprir exigências regulamentares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">5. Compartilhamento de Dados</h2>
              <p className="text-muted-foreground mb-2">Podemos compartilhar suas informações apenas com:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Prestadores de serviços essenciais (processamento de pagamentos, hospedagem)</li>
                <li>Parceiros de negócios (com seu consentimento)</li>
                <li>Autoridades competentes (quando exigido por lei)</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                <strong>Nunca vendemos</strong> seus dados pessoais para terceiros.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">6. Segurança dos Dados</h2>
              <p className="text-muted-foreground">
                Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Treinamento de equipe em proteção de dados</li>
                <li>Auditorias regulares de segurança</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">7. Seus Direitos (LGPD)</h2>
              <p className="text-muted-foreground mb-2">Você tem direito a:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li><strong>Confirmação:</strong> Saber se processamos seus dados</li>
                <li><strong>Acesso:</strong> Obter cópias de seus dados</li>
                <li><strong>Correção:</strong> Atualizar dados incompletos ou incorretos</li>
                <li><strong>Anonimização/Bloqueio:</strong> Limitar o processamento</li>
                <li><strong>Eliminação:</strong> Excluir dados desnecessários</li>
                <li><strong>Portabilidade:</strong> Transferir dados para outro fornecedor</li>
                <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
                <li><strong>Oposição:</strong> Contestar o processamento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">8. Retenção de Dados</h2>
              <p className="text-muted-foreground">
                Mantemos seus dados apenas pelo tempo necessário para:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Fornecer nossos serviços</li>
                <li>Cumprir obrigações legais</li>
                <li>Resolver disputas</li>
                <li>Aplicar nossos acordos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">9. Cookies e Tecnologias Similares</h2>
              <p className="text-muted-foreground">
                Utilizamos cookies para melhorar sua experiência. Você pode controlar cookies através 
                das configurações do seu navegador. Alguns recursos podem não funcionar se você desabilitar cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">10. Transferência Internacional</h2>
              <p className="text-muted-foreground">
                Seus dados podem ser transferidos para servidores localizados fora do Brasil, 
                sempre com garantias adequadas de proteção conforme a LGPD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">11. Menores de Idade</h2>
              <p className="text-muted-foreground">
                Nossos serviços são destinados a maiores de 18 anos. Não coletamos intencionalmente 
                dados de menores sem consentimento dos responsáveis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">12. Alterações na Política</h2>
              <p className="text-muted-foreground">
                Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas 
                através da plataforma ou por e-mail.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">13. Contato e Encarregado de Dados</h2>
              <p className="text-muted-foreground">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, 
                entre em contato através dos canais oficiais da plataforma.
              </p>
              <p className="text-muted-foreground mt-2">
                Você também pode entrar em contato com a Autoridade Nacional de Proteção de Dados (ANPD) 
                para questões relacionadas à proteção de dados.
              </p>
            </section>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Capital Daark</strong><br />
                Comprometidos com sua privacidade e proteção de dados<br />
                Todos os direitos reservados © {new Date().getFullYear()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default PrivacyPolicy;