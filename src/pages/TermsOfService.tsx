import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function TermsOfService() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              Termos de Uso - Capital Daark
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground">
                Ao acessar e usar a plataforma Capital Daark, você concorda em cumprir estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não deverá usar nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">2. Descrição do Serviço</h2>
              <p className="text-muted-foreground">
                A Capital Daark é uma plataforma digital que oferece serviços de tecnologia, notícias, 
                e-commerce e conteúdo especializado. Nossos serviços incluem mas não se limitam a:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Acesso a conteúdo exclusivo e notícias</li>
                <li>Serviços de e-commerce</li>
                <li>Funcionalidades de perfil de usuário</li>
                <li>Sistemas de pagamento seguros</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">3. Cadastro e Conta do Usuário</h2>
              <p className="text-muted-foreground mb-2">
                Para acessar determinados recursos, você deve criar uma conta fornecendo informações precisas e atualizadas. 
                Você é responsável por:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Manter a confidencialidade de sua senha</li>
                <li>Todas as atividades que ocorrem em sua conta</li>
                <li>Notificar-nos imediatamente sobre uso não autorizado</li>
                <li>Fornecer informações verdadeiras e atualizadas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">4. Proteção de Dados Pessoais (LGPD)</h2>
              <p className="text-muted-foreground">
                Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), nos comprometemos a:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Coletar apenas dados necessários para nossos serviços</li>
                <li>Usar seus dados apenas para finalidades legítimas</li>
                <li>Manter seus dados seguros e protegidos</li>
                <li>Permitir que você acesse, corrija ou exclua seus dados</li>
                <li>Não compartilhar seus dados sem consentimento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">5. Uso Aceitável</h2>
              <p className="text-muted-foreground">Você concorda em NÃO:</p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Usar a plataforma para atividades ilegais</li>
                <li>Transmitir conteúdo ofensivo, difamatório ou inadequado</li>
                <li>Tentar acessar áreas restritas do sistema</li>
                <li>Interferir no funcionamento da plataforma</li>
                <li>Violar direitos de propriedade intelectual</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">6. Pagamentos e Reembolsos</h2>
              <p className="text-muted-foreground">
                Para serviços pagos, aplicam-se as seguintes condições:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Pagamentos são processados por meio de gateways seguros</li>
                <li>Reembolsos seguem o Código de Defesa do Consumidor</li>
                <li>Cancelamentos devem ser solicitados conforme nossa política</li>
                <li>Preços podem ser alterados com aviso prévio de 30 dias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">7. Propriedade Intelectual</h2>
              <p className="text-muted-foreground">
                Todo o conteúdo da plataforma, incluindo textos, imagens, logotipos e software, 
                é protegido por direitos autorais e propriedade intelectual da Capital Daark ou de terceiros licenciados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">8. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground">
                A Capital Daark não se responsabiliza por danos indiretos, lucros cessantes ou 
                perdas decorrentes do uso da plataforma, exceto nos casos previstos em lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">9. Modificações dos Termos</h2>
              <p className="text-muted-foreground">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                As alterações entrarão em vigor após a publicação na plataforma. 
                O uso continuado implica aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">10. Lei Aplicável e Foro</h2>
              <p className="text-muted-foreground">
                Estes termos são regidos pela legislação brasileira. 
                Qualquer disputa será resolvida no foro da comarca de localização da empresa, 
                salvo disposição legal em contrário.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">11. Contato</h2>
              <p className="text-muted-foreground">
                Para questões sobre estes termos, entre em contato conosco através dos canais oficiais da plataforma.
              </p>
            </section>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Capital Daark</strong><br />
                Plataforma de Tecnologia e Inovação<br />
                Todos os direitos reservados © {new Date().getFullYear()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default TermsOfService;