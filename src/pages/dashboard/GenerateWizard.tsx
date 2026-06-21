import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, Loader2, Play } from 'lucide-react';
import axios from 'axios';
import { supabase } from '@/lib/supabase/supabase';
import { useAuth } from '@/lib/supabase/AuthProvider';

const steps = [
  'اختيار الموضوع',
  'إعدادات الفيديو',
  'مراجعة السكريبت',
  'إعدادات الصوت',
  'توليد الفيديو'
];

export function GenerateWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [keyword, setKeyword] = useState('');
  
  // Settings State
  const [duration, setDuration] = useState('60');
  const [style, setStyle] = useState('news');
  const [dialect, setDialect] = useState('standard');
  const [platform, setPlatform] = useState('tiktok');
  
  // Script State
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [scriptMetadata, setScriptMetadata] = useState<any>(null);

  // Audio State
  const [voiceId, setVoiceId] = useState('voice1');

  // Progress State
  const [progressStages, setProgressStages] = useState({
    script: true,
    audio: false,
    media: false,
    assemble: false,
    upload: false
  });

  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    try {
      const response = await axios.post('/api/generate/script', {
        keyword,
        duration: parseInt(duration, 10),
        style,
        dialect,
        platform
      });
      setGeneratedScript(response.data.script);
      setScriptMetadata(response.data);
    } catch (error) {
      console.error('Error generating script:', error);
      alert('حدث خطأ أثناء توليد السكريبت');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const { user } = useAuth();
  
  const handleNext = async () => {
    if (currentStep === 1) {
      if (!generatedScript) {
        await handleGenerateScript();
      }
      setCurrentStep(2);
    } else if (currentStep === 3) {
      setIsGenerating(true);
      setCurrentStep(4);
      
      setTimeout(() => setProgressStages(s => ({ ...s, audio: true })), 2000);
      setTimeout(() => setProgressStages(s => ({ ...s, media: true })), 4000);
      setTimeout(() => setProgressStages(s => ({ ...s, assemble: true })), 6000);
      setTimeout(async () => {
        setProgressStages(s => ({ ...s, upload: true, done: true }));
        // Save to supabase
        if (user) {
          try {
            await supabase.from('videos').insert({
              user_id: user.id,
              title: keyword || 'فيديو جديد',
              duration: duration + 's',
              status: 'جاهز',
              video_url: 'https://example.com/video.mp4',
            });
          } catch (e) {
            console.error('Failed to save to database', e);
          }
        }
      }, 8000);
    } else {
      setCurrentStep(prev => Math.min(4, prev + 1));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Label className="text-card-foreground font-bold block mb-2">بحث يدوي أو اختيار من قائمة الترندات</Label>
            <Input 
              placeholder="أدخل موضوع الفيديو (مثال: الذكاء الاصطناعي)..." 
              className="bg-muted border-none rounded-xl h-12 focus-visible:ring-ring"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {keyword.length > 0 && <p className="text-xs font-bold text-amber-500 mt-2">ملاحظة: تأكد أن الموضوع مناسب لسياسات المنصة.</p>}
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-card-foreground font-bold text-sm">مدة الفيديو</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="bg-muted border-none rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30ث</SelectItem>
                  <SelectItem value="60">60ث</SelectItem>
                  <SelectItem value="180">3د</SelectItem>
                  <SelectItem value="300">5د</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-card-foreground font-bold text-sm">الأسلوب</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-muted border-none rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="news">إخباري</SelectItem>
                  <SelectItem value="entertainment">ترفيهي</SelectItem>
                  <SelectItem value="educational">تعليمي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-card-foreground font-bold text-sm">اللهجة</Label>
              <Select value={dialect} onValueChange={setDialect}>
                <SelectTrigger className="bg-muted border-none rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">فصحى</SelectItem>
                  <SelectItem value="egyptian">مصري</SelectItem>
                  <SelectItem value="gulf">خليجي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-card-foreground font-bold text-sm">المنصة</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="bg-muted border-none rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">يوتيوب Shorts</SelectItem>
                  <SelectItem value="tiktok">تيك توك</SelectItem>
                  <SelectItem value="instagram">انستغرام Reels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            {!isGeneratingScript ? (
              <>
                <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  <span>المدة المتوقعة: ~{scriptMetadata?.estimatedDuration || duration} ثانية</span>
                  <span>{scriptMetadata?.wordCount || '0'} كلمة</span>
                </div>
                <Textarea 
                  className="min-h-[250px] bg-muted border-none rounded-xl text-card-foreground leading-relaxed resize-none p-4 focus-visible:ring-ring"
                  value={generatedScript}
                  onChange={(e) => setGeneratedScript(e.target.value)}
                />
                <Button 
                  variant="outline" 
                  onClick={handleGenerateScript}
                  className="w-full border-border text-primary rounded-xl font-bold h-12 hover:bg-primary/10 mt-4"
                >
                  <RefreshCw className="w-4 h-4 ml-2" />
                  أعد توليد السكريبت
                </Button>
              </>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="font-bold text-card-foreground">جاري كتابة السكريبت بواسطة الذكاء الاصطناعي...</p>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-card-foreground font-bold text-sm">ElevenLabs (اختيار الصوت)</Label>
              <Select value={voiceId} onValueChange={setVoiceId}>
                <SelectTrigger className="bg-muted border-none rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="voice1">أحمد (أخباري فصحى)</SelectItem>
                  <SelectItem value="voice2">نور (شبابي مصري)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="secondary" className="w-full bg-accent text-foreground hover:bg-accent rounded-xl font-bold h-12 relative overflow-hidden">
              <Play className="w-4 h-4 ml-2" />
              تجربة الصوت (Preview)
            </Button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 py-4">
            <h3 className="text-xl font-bold text-center text-card-foreground">
              {(progressStages as any).done ? 'اكتمل إنشاء الفيديو!' : 'جاري إنشاء الفيديو...'}
            </h3>
            <div className="space-y-5 max-w-sm mx-auto">
              {/* Script Step */}
              <div className={`flex items-center gap-4 ${progressStages.script ? 'text-success' : 'text-muted-foreground'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${progressStages.script ? 'bg-success/20' : 'border-2 border-border'}`}>
                  {progressStages.script && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <span className="font-bold text-sm">توليد السكريبت</span>
              </div>
              
              {/* Audio Step */}
              <div className={`flex items-center gap-4 ${progressStages.audio ? 'text-success' : (!progressStages.audio && progressStages.script && !(progressStages as any).done ? 'text-primary' : 'text-muted-foreground')}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${progressStages.audio ? 'bg-success/20' : (!progressStages.audio && progressStages.script && !(progressStages as any).done ? 'bg-primary/20' : 'border-2 border-border')}`}>
                  {progressStages.audio ? <CheckCircle2 className="w-4 h-4" /> : (!progressStages.audio && progressStages.script && !(progressStages as any).done ? <Loader2 className="w-4 h-4 animate-spin" /> : null)}
                </div>
                <span className="font-bold text-sm">تحويل النص لصوت</span>
              </div>

              {/* Media Step */}
              <div className={`flex items-center gap-4 ${progressStages.media ? 'text-success' : (!progressStages.media && progressStages.audio && !(progressStages as any).done ? 'text-primary' : 'text-muted-foreground')}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${progressStages.media ? 'bg-success/20' : (!progressStages.media && progressStages.audio && !(progressStages as any).done ? 'bg-primary/20' : 'border-2 border-border')}`}>
                  {progressStages.media ? <CheckCircle2 className="w-4 h-4" /> : (!progressStages.media && progressStages.audio && !(progressStages as any).done ? <Loader2 className="w-4 h-4 animate-spin" /> : null)}
                </div>
                <span className="font-medium text-sm">جلب الصور والفيديوهات</span>
              </div>
              
              {/* Assemble Step */}
              <div className={`flex items-center gap-4 ${progressStages.assemble ? 'text-success' : (!progressStages.assemble && progressStages.media && !(progressStages as any).done ? 'text-primary' : 'text-muted-foreground')}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${progressStages.assemble ? 'bg-success/20' : (!progressStages.assemble && progressStages.media && !(progressStages as any).done ? 'bg-primary/20' : 'border-2 border-border')}`}>
                  {progressStages.assemble ? <CheckCircle2 className="w-4 h-4" /> : (!progressStages.assemble && progressStages.media && !(progressStages as any).done ? <Loader2 className="w-4 h-4 animate-spin" /> : null)}
                </div>
                <span className="font-medium text-sm">تجميع الفيديو</span>
              </div>

              {/* Upload Step */}
              <div className={`flex items-center gap-4 ${progressStages.upload ? 'text-success' : (!progressStages.upload && progressStages.assemble && !(progressStages as any).done ? 'text-primary' : 'text-muted-foreground')}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${progressStages.upload ? 'bg-success/20' : (!progressStages.upload && progressStages.assemble && !(progressStages as any).done ? 'bg-primary/20' : 'border-2 border-border')}`}>
                  {progressStages.upload ? <CheckCircle2 className="w-4 h-4" /> : (!progressStages.upload && progressStages.assemble && !(progressStages as any).done ? <Loader2 className="w-4 h-4 animate-spin" /> : null)}
                </div>
                <span className="font-medium text-sm">رفع على Firebase</span>
              </div>
            </div>
            
            {(progressStages as any).done && (
              <div className="flex justify-center mt-6 gap-4">
                <Button className="bg-primary text-white rounded-xl font-bold h-12 shadow-sm">مشاهدة الفيديو</Button>
                <Button variant="outline" className="border-border text-muted-foreground rounded-xl font-bold h-12" onClick={() => window.location.href = '/dashboard/library'}>مكتبة الفيديوهات</Button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-4 flex flex-col h-full space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-card-foreground mb-8">خطوات توليد الفيديو</h2>
        <div className="flex justify-between relative px-2">
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-accent -z-10 -translate-y-1/2 rounded-full" />
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                i === currentStep ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-sm z-10' :
                i < currentStep ? 'bg-success text-primary-foreground shadow-sm z-10' : 'bg-card text-muted-foreground border-2 border-border z-10'
              }`}>
                {i < currentStep ? <CheckCircle2 className="w-5 h-5 text-white" /> : <span className="font-bold">{i + 1}</span>}
              </div>
              <span className={`text-[11px] uppercase tracking-wider font-bold text-center ${i === currentStep ? 'text-primary' : 'text-muted-foreground'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-3xl shadow-sm border border-border p-8 flex-1">
        {renderStepContent()}
      </div>

      <div className="flex justify-between mt-auto">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0 || currentStep === 4 || isGeneratingScript}
          className="border-border text-muted-foreground hover:bg-muted rounded-xl font-bold h-12 px-6 shadow-sm"
        >
          <ArrowRight className="w-5 h-5 ml-2" />
          السابق
        </Button>
        <Button 
          onClick={handleNext}
          disabled={currentStep === 4 || isGeneratingScript || (currentStep === 0 && !keyword)}
          className="bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold h-12 px-8 shadow-sm"
        >
          {currentStep === 3 ? 'ابدأ التوليد' : 'التالي'}
          {currentStep !== 3 && <ArrowLeft className="w-5 h-5 mr-2" />}
        </Button>
      </div>
    </div>
  );
}

