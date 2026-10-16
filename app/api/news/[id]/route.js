
import { NextResponse } from 'next/server';
import supabase from '@/lib/db/supabase';
import { TRANSLATABLE_FIELDS, translateRows } from '@/lib/i18n/contentTranslation';

const TABLE_MAP = {
  news: 'news_articles',
  events: 'events_live',
  opportunities: 'opportunities_live',
  library: 'library_resources'
};

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const table = TABLE_MAP['news'];

    // If the English text changed and the admin didn't supply translations, refresh them.
    const fields = TRANSLATABLE_FIELDS['news_articles'] || [];
    if (!body.translations && fields.some((f) => typeof body[f] === 'string')) {
      const { data: current } = await supabase.from(table).select(fields.join(',')).eq('id', id).single();
      const [translations] = await translateRows('news_articles', [{ ...(current || {}), ...body }]);
      if (translations) body.translations = translations;
    }
    
    const { data, error } = await supabase.from(table).update(body).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const table = TABLE_MAP['news'];
    
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw new Error(error.message);
    
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
